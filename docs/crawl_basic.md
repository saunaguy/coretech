**Purpose**
- Crawl public web pages without any API key. Extract title and main text.

**Install**
- `pip install -r 0908/coretech/requirements.txt` (network approval may be required).

**Usage**
- Single URL: `python 0908/coretech/scripts/crawl_basic.py --urls https://example.com --out 0908/coretech/assets/basic_crawl.ndjson`
- From file: `python 0908/coretech/scripts/crawl_basic.py --in-file 0908/coretech/assets/urls.txt --out 0908/coretech/assets/basic_crawl.ndjson`
- Options: `--delay 0.5` (seconds between requests), `--timeout 20`.

**Notes**
- Respects redirects and parses HTML only; binaries/PDFs are skipped.
- For robots.txt compliance or authenticated pages, extend the crawler accordingly.
