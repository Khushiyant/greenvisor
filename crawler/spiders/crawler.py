# standalone Scrapy spider script for deeper Baden energy legislation crawl
# save this as crawler.py and run with: python crawler.py
import os
from urllib.parse import urlparse
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

# ensure output folder exists
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data', 'raw'))
os.makedirs(OUTPUT_DIR, exist_ok=True)

def load_start_urls(file_path):
    """Load start URLs from a file, one per line."""
    with open(file_path, 'r', encoding='utf-8') as f:
        urls = []
        for line in f:
            if line.strip():
                # Strip any quotes and whitespace that might be present
                url = line.strip().strip('\'"')
                urls.append(url)
        return urls

class BadenEnergySpider(CrawlSpider):
    name = 'baden_energy'
    allowed_domains = [
        'gesetze-im-internet.de', 'landtag-bw.de', 'landesrecht-bw.de',
        'bafa.de', 'kfw.de', 'verbraucherzentrale-energieberatung.de',
        'ebz-stuttgart.de', 'klimaschutz-niedersachsen.de', 'kww-halle.de',
        'kea-bw.de', 'badenova.de', 'freiburg.de',
        'sanierungsfahrplan-badenova.de', 'viessmann.de',
        'aroundhome.de', 'schwaebisch-hall.de'
    ]
    start_urls = []  # will be set in __init__

    custom_settings = {
        # store files and html in OUTPUT_DIR
        'FILES_STORE': OUTPUT_DIR,
        'DEPTH_LIMIT': 5,
        'DOWNLOAD_DELAY': 1.0,
        'ROBOTSTXT_OBEY': True,
        'USER_AGENT': 'BadenEnergyBot/1.0 (+https://example.com/info)',
        'ITEM_PIPELINES': {
            '__main__.RawItemPipeline': 1,
            'scrapy.pipelines.files.FilesPipeline': 2,
        },
        'LOG_LEVEL': 'INFO',
    }

    rules = (
        Rule(LinkExtractor(allow_domains=allowed_domains), callback='parse_page', follow=True),
    )

    def __init__(self, start_urls_file='start_urls.txt', *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.start_urls = load_start_urls(start_urls_file)

    def parse_page(self, response):
        url = response.url
        if url.lower().endswith('.pdf'):
            yield {'file_urls': [url]}
        else:
            yield {
                'url': url,
                'raw_text': response.text
            }

class RawItemPipeline:
    def process_item(self, item, spider):
        if 'raw_text' in item:
            parsed = urlparse(item['url'])
            fname = f"{parsed.netloc}{parsed.path.replace('/', '_') or '_root'}.html"
            path = os.path.join(OUTPUT_DIR, fname)
            with open(path, 'w', encoding='utf-8') as f:
                f.write(item['raw_text'])
        return item

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser(description="Scrapy-based Baden energy legislation crawler.")
    parser.add_argument('--start-urls', type=str, default='start_urls.txt',
                        help='Path to file containing start URLs (one per line)')
    args = parser.parse_args()
    process = CrawlerProcess()
    process.crawl(BadenEnergySpider, start_urls_file=args.start_urls)
    process.start()
