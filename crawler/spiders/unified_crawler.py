import os
import asyncio
import json
import argparse
import hashlib
import threading
from aiohttp import ClientSession, TCPConnector
from asyncio_throttle import Throttler
from urllib.parse import urljoin, urldefrag, urlparse
from bs4 import BeautifulSoup
import io
import pdfplumber
import time
from typing import Dict, Set, Any

# Configuration
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw'))
GRAPH_PATH = os.path.abspath('crawl_graph.json')
MAX_CONCURRENT = 16
REQUESTS_PER_SECOND = 2
MAX_DEPTH = 3

# Unwanted content filtering
UNWANTED_KEYWORDS = [...]
ALLOWED_DOMAINS = [...]

# Throttler and locks
throttler = Throttler(rate_limit=REQUESTS_PER_SECOND)
content_hashes = set()
content_lock = threading.Lock()
graph_lock = threading.Lock()

# Initialize artifact files
open(GRAPH_PATH, 'a').close()

async def fetch(url: str, session: ClientSession):
    """Fetch resource with robust error handling and throttling."""
    async with throttler:
        resp = await session.get(url, timeout=30)
        return url, await resp.read(), resp.headers.get('Content-Type', '')

def is_duplicate(content: bytes) -> bool:
    """Check if content has been seen before using SHA256 hash."""
    h = hashlib.sha256(content).hexdigest()
    with content_lock:
        if h in content_hashes:
            return True
        content_hashes.add(h)
    return False

def extract_text(url: str, content: bytes, ctype: str) -> str:
    """Extract text from either PDF or HTML content."""
    is_pdf = url.lower().endswith('.pdf') or 'application/pdf' in ctype
    if is_pdf:
        text_output = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            for page in pdf.pages:
                if text := page.extract_text():
                    text_output.append(text)
        return '\n\n'.join(text_output)
    else:
        html = content.decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'lxml')
        for tag in soup(['script', 'style', 'nav', 'header', 'footer']):
            tag.decompose()
        return ' '.join(line.strip() for line in soup.get_text().splitlines() if line.strip())

def extract_links(url: str, content: bytes, ctype: str) -> list:
    """Extract valid links from content."""
    if 'application/pdf' in ctype:
        return []
    
    links = set()
    try:
        html = content.decode('utf-8', errors='ignore')
        soup = BeautifulSoup(html, 'lxml')
        for a in soup.find_all('a', href=True):
            href = urljoin(url, a['href'])
            href = urldefrag(href)[0]
            parsed = urlparse(href)
            if parsed.netloc in ALLOWED_DOMAINS and not any(kw in href.lower() for kw in UNWANTED_KEYWORDS):
                links.add(href)
    except Exception as e:
        print(f"Error extracting links from {url}: {e}")
    return list(links)

async def save_content(url, content, ctype, data):
    """Persist raw content and extract text."""
    if is_duplicate(content):
        print(f"[SKIP] Duplicate @ {url}")
        return

    text = extract_text(url, content, ctype)
    data['processed'].append(url)
    print(f"[OK] {url}")

async def worker(name, session, queue, seen, graph, data):
    while True:
        url, depth, parent = await queue.get()
        if depth > MAX_DEPTH:
            queue.task_done()
            continue
        try:
            url, content, ctype = await fetch(url, session)
            await save_content(url, content, ctype, data)
            with graph_lock:
                graph[url] = dict(parent=parent, children=[], depth=depth)
                if parent:
                    graph[parent]['children'].append(url)
                json.dump(graph, open(GRAPH_PATH, 'w'), indent=2)
            if depth < MAX_DEPTH:
                for link in extract_links(url, content, ctype):
                    if link not in seen:
                        seen.add(link)
                        await queue.put((link, depth + 1, url))
        except Exception as e:
            print(f"[ERROR] {url}: {e}")
            data['failed'].append(url)
        finally:
            queue.task_done()

async def main(start_urls_file: str):
    """Main crawler execution."""
    data = {'processed': [], 'failed': []}
    graph = {}
    seen: Set[str] = set()
    
    with open(start_urls_file) as f:
        start_urls = [line.strip() for line in f if line.strip()]

    if not start_urls:
        print("No start URLs provided!")
        return

    queue = asyncio.Queue()
    for url in start_urls:
        seen.add(url)
        await queue.put((url, 0, None))

    connector = TCPConnector(limit=MAX_CONCURRENT)
    async with ClientSession(connector=connector) as session:
        workers = [
            asyncio.create_task(
                worker(f'worker-{i}', session, queue, seen, graph, data)
            )
            for i in range(MAX_CONCURRENT)
        ]
        await queue.join()
        for w in workers:
            w.cancel()

    print("\nCrawl Summary:")
    print(f"Processed: {len(data['processed'])} URLs")
    print(f"Failed: {len(data['failed'])} URLs")
    print(f"Total unique content: {len(content_hashes)}")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Web crawler")
    parser.add_argument('--start-urls', type=str, default='start_urls.txt',
                      help='File containing start URLs (one per line)')
    args = parser.parse_args()

    print(f"Starting crawler (depth={MAX_DEPTH}, workers={MAX_CONCURRENT})")
    asyncio.run(main(args.start_urls))
