This Python script preprocesses HTML and TXT files. It extracts text, cleans it, removes language-specific stopwords (e.g., German, English), and saves the resulting tokens.

Usage:

    Place raw HTML/TXT files in the data/raw/ directory.
    Run python preprocess.py.
    Processed files (tokens after stopword removal) are saved to data/cleaned/ with a _tokens_no_stopwords.txt suffix.

The script defaults to processing all files in data/raw/ using German stopwords. You can modify the if __name__ == "__main__": block to process a single file interactively if needed.

# Energy data Crawler & Preprocessor

This project provides a complete pipeline to **crawl**, **extract**, and **preprocess** energy-related legal documents from German websites. The system handles both HTML and PDF documents, extracts clean plain text, removes stopwords, and saves the cleaned tokens for further analysis.

---

## 📁 Project Structure

```
.
├── crawler.py                # Scrapy-based spider for domain-specific crawling
├── fast_crawler.py           # Asyncio-based crawler with crawl-depth and PDF/HTML extraction
├── preprocess.py             # Preprocessing pipeline to clean and tokenize text
├── start_urls.txt            # List of seed URLs for fast_crawler.py
├── crawl_graph.json          # (Generated) Crawl tree visualizing parent-child relationships
├── data/
│   ├── raw/                  # Place raw .html and .txt files here before preprocessing
│   └── cleaned/              # Output directory for processed, tokenized files
├── downloaded_files/         # Output of crawler.py (Scrapy)
└── downloaded_files_soup/    # Output of fast_crawler.py (asyncio)
```


Install all dependencies with:

```bash
pip install -r requirements.txt
```

If you don’t have a `requirements.txt` yet, here are the packages you need:

```bash
pip install scrapy aiohttp asyncio-throttle beautifulsoup4 lxml pdfplumber
```

---

## 🕷️ Crawling Scripts

### 1. `crawler.py` — Scrapy Spider

Structured crawler for legal/energy-related German websites.

#### ✅ Usage:

```bash
python crawler.py
```

#### 🔧 Features:

* Obeys `robots.txt`
* Crawl depth limit: 5
* Respects polite download delays (1s)
* Extracts full HTML and downloads PDFs
* Saves to: `downloaded_files/`

---

### 2. `fast_crawler.py` — Asyncio-based Crawler

Asynchronous, high-throughput crawler with support for:

* Crawl depth control
* HTML-to-text cleaning
* PDF text extraction
* Live crawl graph (`crawl_graph.json`)

#### ✅ Usage:

```bash
python fast_crawler.py --start-urls start_urls.txt
```

* Ensure `start_urls.txt` contains one seed URL per line.
* Extracted `.txt` files saved to: `downloaded_files_soup/`

#### 🔍 Example `start_urls.txt`:

```
https://www.gesetze-im-internet.de/geg/GEG.pdf
https://www.landesrecht-bw.de/
https://www.bafa.de/
```

---

## 🧹 Text Preprocessing

### 3. `preprocess.py` — Clean & Tokenize

This Python script preprocesses HTML and TXT files. It extracts text, cleans it, removes language-specific stopwords (e.g., German, English), and saves the resulting tokens.

Usage:

    Place raw HTML/TXT files in the data/raw/ directory.
    Run python preprocess.py.
    Processed files (tokens after stopword removal) are saved to data/cleaned/ with a _tokens_no_stopwords.txt suffix.

The script defaults to processing all files in data/raw/ using German stopwords. You can modify the if __name__ == "__main__": block to process a single file interactively if needed.

#### ✅ Usage:

```bash
python preprocess.py
```

#### 📁 Input Directory:

* `data/raw/`: Place `.html` or `.txt` files here.

#### 📁 Output Directory:

* `data/cleaned/`: Processed files saved with `_tokens_no_stopwords.txt` suffix.

#### 🧠 Stopword Support:

* Automatically applies stopword removal for:

  * German (`stopwords.words("german")`)
  * English (`stopwords.words("english")`)
* Can be customized to support more languages.

---

## 💡 Example Workflow

```bash
# Step 1: Crawl the web for relevant documents
python fast_crawler.py --start-urls start_urls.txt

# Step 2: Move downloaded text files to preprocessing folder
cp downloaded_files_soup/*.txt data/raw/

# Step 3: Clean and tokenize
python preprocess.py

# Done! Your cleaned tokens are in data/cleaned/
```

---

## 📈 Crawl Graph Visualization

The `fast_crawler.py` script generates a `crawl_graph.json` file that records the crawl hierarchy. You can use it to:

* Visualize parent-child link structure
* Debug crawl depth or loops
* Analyze site structure

Use tools like [d3.js](https://d3js.org/), [networkx](https://networkx.org/), or [Graphviz](https://graphviz.org/) to visualize it.

---

## 🔧 Configuration Options

You can customize several parameters in the scripts:

| Parameter             | Location          | Description                           |
| --------------------- | ----------------- | ------------------------------------- |
| `MAX_DEPTH`           | `fast_crawler.py` | Max depth for crawling links          |
| `OUTPUT_DIR`          | all scripts       | Where output is saved                 |
| `REQUESTS_PER_SECOND` | `fast_crawler.py` | Throttle rate per worker              |
| `allowed_domains`     | `crawler.py`      | Restricts domains for link extraction |

---

## 🛠️ Troubleshooting

* **Encoding issues in HTML**: The crawler uses `decode(errors='ignore')` to handle messy pages.
* **Missing stopwords**: Run `nltk.download('stopwords')` if needed.
* **No links being followed?**

  * Ensure URLs are correct in `start_urls.txt`
  * Increase `MAX_DEPTH` to crawl deeper

## Further development Notes

**Version V.0.0.2** – streamline of the code so that the entire process of scraping with filters for PDFs and URLs takes place together. Next planned functionality: fetching URLs from a remote hosted Google Sheet or database.

Better visualization and combine preprocess and scraping. 


## Proposed update 
dynamic setting of cralwer depth 