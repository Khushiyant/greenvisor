# fast_crawler.py: asyncio scraper with clean text extraction and depth control
# Save as fast_crawler.py and run with: python fast_crawler.py
# Extracts raw text from HTML and PDF, saves as .txt in 'downloaded_files'
import os
import asyncio
import json
import argparse
from aiohttp import ClientSession, TCPConnector
from asyncio_throttle import Throttler
from urllib.parse import urljoin, urldefrag, urlparse
from bs4 import BeautifulSoup
import io
import pdfplumber
import threading
import time

# Configuration
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'raw')  # Directory where data is saved
OUTPUT_DIR = os.path.abspath(OUTPUT_DIR)
MAX_CONCURRENT = 10
REQUESTS_PER_SECOND = 2
MAX_DEPTH = 3 # maximum crawl depth

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Rate limiter
throttler = Throttler(rate_limit=REQUESTS_PER_SECOND)

def load_start_urls(file_path):
    """Load start URLs from a file, one per line."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return [line.strip() for line in f if line.strip()]

async def fetch(url: str, session: ClientSession):
    """Fetch raw bytes for a URL with throttling."""
    async with throttler:
        async with session.get(url) as response:
            content = await response.read()
            return url, content, response.headers.get('Content-Type', '')

def html_to_text(html: str) -> str:
    """Convert raw HTML to clean plain text."""
    soup = BeautifulSoup(html, 'lxml')
    for tag in soup(['script', 'style', 'nav', 'header', 'footer']):
        tag.decompose()
    text = soup.get_text(separator='\n')
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return '\n'.join(lines)

async def save_pdf_text(content: bytes, path_base: str):
    """Extract text from PDF bytes and save to a .txt file."""
    text_output = []
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ''
            text_output.append(page_text)
    txt_path = path_base + '.txt'
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(text_output))

async def save_content(url: str, content: bytes, content_type: str):
    """Save cleaned text to a .txt file for both HTML and PDF."""
    parsed = urlparse(url)
    safe_name = (parsed.netloc + parsed.path).replace('/', '_') or '_root'
    is_pdf = url.lower().endswith('.pdf') or 'application/pdf' in content_type
    if is_pdf:
        await save_pdf_text(content, os.path.join(OUTPUT_DIR, safe_name))
        print(f"Extracted text from PDF {url} -> {safe_name}.txt")
    else:
        html = content.decode('utf-8', errors='ignore')
        text = html_to_text(html)
        txt_path = os.path.join(OUTPUT_DIR, safe_name + '.txt')
        with open(txt_path, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Extracted text from HTML {url} -> {safe_name}.txt")

async def extract_links(url: str, content: bytes, content_type: str):
    """Extract in-domain links from HTML content; skip PDFs."""
    is_pdf = url.lower().endswith('.pdf') or 'application/pdf' in content_type
    if is_pdf:
        return []
    html = content.decode('utf-8', errors='ignore')
    soup = BeautifulSoup(html, 'lxml')
    links = set()
    for a in soup.find_all('a', href=True):
        href = urljoin(url, a['href'])
        href, _ = urldefrag(href)
        parsed = urlparse(href)
        if parsed.netloc in ALLOWED_DOMAINS:
            links.add(href)
    return list(links)

async def worker(name: str, session: ClientSession, queue: asyncio.Queue, seen: set, crawl_graph: dict, graph_lock):
    """Worker that fetches URLs, extracts text, and enqueues new links with depth."""
    while True:
        url, depth, parent = await queue.get()
        try:
            if depth > MAX_DEPTH:
                queue.task_done()
                continue
            url, content, ctype = await fetch(url, session)
            await save_content(url, content, ctype)
            # Record parent-child relationship
            with graph_lock:
                if url not in crawl_graph:
                    crawl_graph[url] = {"parent": parent, "children": []}
                if parent:
                    crawl_graph.setdefault(parent, {"parent": None, "children": []})
                    crawl_graph[parent]["children"].append(url)
                # Save crawl graph after each new node for live visualization
                with open('crawl_graph.json', 'w', encoding='utf-8') as f:
                    json.dump(crawl_graph, f, indent=2)
            print(f"[{name}] Crawled: {url} (depth {depth})")  # Live feedback
            if depth < MAX_DEPTH:
                for link in await extract_links(url, content, ctype):
                    if link not in seen:
                        seen.add(link)
                        await queue.put((link, depth+1, url))
        except Exception as e:
            print(f"{name} error fetching {url}: {e}")
        finally:
            queue.task_done()

async def main(start_urls_file):
    START_URLS = load_start_urls(start_urls_file)
    global ALLOWED_DOMAINS
    ALLOWED_DOMAINS = {urlparse(url).netloc for url in START_URLS}
    queue = asyncio.Queue()
    seen = set()
    crawl_graph = {}
    graph_lock = threading.Lock()
    for url in START_URLS:
        seen.add(url)
        await queue.put((url, 0, None))  # initial depth = 0, no parent
    connector = TCPConnector(limit=MAX_CONCURRENT)
    async with ClientSession(connector=connector) as session:
        tasks = [asyncio.create_task(worker(f'worker-{i}', session, queue, seen, crawl_graph, graph_lock))
                 for i in range(MAX_CONCURRENT)]
        await queue.join()
        for t in tasks:
            t.cancel()
    # Final save (redundant, but ensures file is up to date)
    with graph_lock:
        with open('crawl_graph.json', 'w', encoding='utf-8') as f:
            json.dump(crawl_graph, f, indent=2)
    print(f"Crawl complete. Graph saved to crawl_graph.json. {len(crawl_graph)} nodes crawled.")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Async web crawler with crawl graph visualization support.")
    parser.add_argument('--start-urls', type=str, default='start_urls.txt',
                        help='Path to file containing start URLs (one per line)')
    args = parser.parse_args()
    print(f"Starting crawl with max depth {MAX_DEPTH}; extracting text to '{OUTPUT_DIR}'")
    asyncio.run(main(args.start_urls))

# Usage:
# pip install aiohttp asyncio-throttle beautifulsoup4 lxml pdfplumber
# Populate start_urls.txt, set MAX_DEPTH, then run: python fast_crawler.py --start-urls start_urls.txt
# Resulting .txt files will be in 'downloaded_files' folder.
