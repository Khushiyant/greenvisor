# standalone Scrapy spider script for deeper Baden energy legislation crawl
# save this as crawler.py and run with: python crawler.py
import os
from urllib.parse import urlparse
import scrapy
from scrapy.crawler import CrawlerProcess
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

# ensure output folder exists
OUTPUT_DIR = 'downloaded_files'
os.makedirs(OUTPUT_DIR, exist_ok=True)

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
    start_urls = [
        'https://www.kfw.de/inlandsfoerderung/Privatpersonen/Bestehende-Immobilie/Energieeffizient-sanieren/Maßnahmen-für-Energieeffizienz/',

    ]

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
    process = CrawlerProcess()
    process.crawl(BadenEnergySpider)
    process.start()
