# fast_crawler.py: asyncio scraper with PDF text extraction
# save this as fast_crawler.py and run with: python fast_crawler.py
# All downloaded files (.html, .pdf) and extracted texts (.txt) are saved in the 'downloaded_files' folder
import os
import asyncio
from aiohttp import ClientSession, TCPConnector
from asyncio_throttle import Throttler
from urllib.parse import urljoin, urldefrag, urlparse
from bs4 import BeautifulSoup
import io
import pdfplumber

# Configuration
OUTPUT_DIR = 'downloaded_files'  # Directory where data is saved
START_URLS = [
    'https://www.gesetze-im-internet.de/geg/GEG.pdf',
    
    # ... include all other URLs from your list ...
]
ALLOWED_DOMAINS = {urlparse(url).netloc for url in START_URLS}
MAX_CONCURRENT = 10
REQUESTS_PER_SECOND = 2

# Ensure the output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Throttler for rate limiting
throttler = Throttler(rate_limit=REQUESTS_PER_SECOND)

async def fetch(url: str, session: ClientSession):
    """Fetch raw bytes for a given URL with throttling."""
    async with throttler:
        async with session.get(url) as response:
            content = await response.read()
            return url, content, response.headers.get('Content-Type', '')

async def save_pdf_text(content: bytes, path_base: str):
    """Extract text from PDF bytes and save to a .txt file."""
    text_output = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            text_output.append(page.extract_text() or '')
    txt_path = path_base + '.txt'
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(text_output))

async def save_content(url: str, content: bytes, content_type: str):
    """Save content to disk. PDFs as .pdf plus .txt, HTML as .html."""
    parsed = urlparse(url)
    safe_name = (parsed.netloc + parsed.path).replace('/', '_') or '_root'
    is_pdf = url.lower().endswith('.pdf') or 'application/pdf' in content_type
    if is_pdf:
        # Save original PDF
        pdf_path = os.path.join(OUTPUT_DIR, safe_name + '.pdf')
        with open(pdf_path, 'wb') as f:
            f.write(content)
        # Extract and save text from PDF
        await save_pdf_text(content, os.path.join(OUTPUT_DIR, safe_name))
        print(f"Saved PDF and extracted text for {url} to {OUTPUT_DIR}")
    else:
        # Save HTML content
        html_path = os.path.join(OUTPUT_DIR, safe_name + '.html')
        with open(html_path, 'wb') as f:
            f.write(content)
        print(f"Saved HTML for {url} to {OUTPUT_DIR}")

async def extract_links(url: str, content: bytes, content_type: str):
    """Extract in-domain links from HTML content; skip PDFs."""
    is_pdf = url.lower().endswith('.pdf') or 'application/pdf' in content_type
    if is_pdf:
        return []
    soup = BeautifulSoup(content, 'lxml')
    links = set()
    for a in soup.find_all('a', href=True):
        href = urljoin(url, a['href'])
        href, _ = urldefrag(href)
        netloc = urlparse(href).netloc
        if netloc in ALLOWED_DOMAINS:
            links.add(href)
    return list(links)

async def worker(name: str, session: ClientSession, queue: asyncio.Queue, seen: set):
    """Worker that fetches URLs, saves content, and enqueues new links."""
    while True:
        url = await queue.get()
        try:
            url, content, ctype = await fetch(url, session)
            await save_content(url, content, ctype)
            for link in await extract_links(url, content, ctype):
                if link not in seen:
                    seen.add(link)
                    await queue.put(link)
        except Exception as e:
            print(f"{name} error fetching {url}: {e}")
        finally:
            queue.task_done()

async def main():
    queue = asyncio.Queue()
    seen = set(START_URLS)
    for url in START_URLS:
        await queue.put(url)

    connector = TCPConnector(limit=MAX_CONCURRENT)
    async with ClientSession(connector=connector) as session:
        tasks = [asyncio.create_task(worker(f'worker-{i}', session, queue, seen))
                 for i in range(MAX_CONCURRENT)]
        await queue.join()
        for t in tasks:
            t.cancel()

if __name__ == '__main__':
    print(f"Starting crawl; saving all data to '{OUTPUT_DIR}'")
    asyncio.run(main())

# Usage:
#   pip install aiohttp asyncio-throttle beautifulsoup4 lxml pdfplumber
#   Populate START_URLS fully, then run:
#   python fast_crawler.py
# All resulting .html, .pdf, and .txt files will be in the 'downloaded_files' folder.
