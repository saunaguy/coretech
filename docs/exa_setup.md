**Purpose**
- Add a minimal EXA API client and CLI to run searches/crawls and save results.

**Setup**
- Copy `.env.example` to `.env` and set `EXA_API_KEY`.
- Install deps: `pip install -r requirements.txt` (network approval may be required).

**CLI Usage**
- Search: `python scripts/crawl_with_exa.py search --query "golang concurrency" --max-results 20 --out assets/exa_search.ndjson`
- Contents: `python scripts/crawl_with_exa.py contents --ids ABC123 DEF456 --out assets/exa_contents.ndjson`
- Crawl: `python scripts/crawl_with_exa.py crawl --urls https://example.com https://example.org --max-depth 0 --out assets/exa_crawl.ndjson`

**Notes**
- Network is restricted by default; approve the first network request when prompted.
- Endpoints/payloads can differ by EXA plan/version; adjust in `src/tools/exa_client.py` if needed.
- Results are saved as NDJSON under `assets/` for easy downstream processing.
