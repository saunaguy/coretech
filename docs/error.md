# Error Log Notes

## 2025-10-10 Board Comment / Delete Fixes

### Symptoms
- Console showed `Failed to fetch comments: Error: API call failed with non-JSON response` (HTTP 500).
- Deleting a board post returned 500 with backend log `AttributeError: 'Post' object has no attribute 'author_id'`.

### Root Causes
1. Comment responses omitted the `is_accepted` field, causing FastAPI response validation to raise and serve an HTML error page instead of JSON.
2. Post deletion authorization checked a non-existent `author_id` column rather than `user_id`.

### Fixes Applied
- Updated `backend/backend_src/main.py` to fully populate post details, include comment author data, and validate delete permissions against `user_id`.
- Added `is_accepted` to comment responses in `backend/backend_src/routers/likes_and_comments.py` so they match the schema.
- Cleaned up frontend helpers (`CommentSection`, `BoardActions`, `DeleteButton`) so controls respect auth state and use consistent English copy.

### Verification Steps
1. `docker compose down && docker compose up -d --build db backend frontend`
2. Visit `http://localhost:3000/board/{POST_ID}` and confirm:
   - Comments load, submit, and delete without console errors.
   - Deleting a post returns HTTP 204 and redirects back to the board list.

### Notes
- `API_BASE_URL` remains `http://localhost:8000`; when deploying to an IP/domain, add it to `CORS_ORIGINS`.
- `INACTIVITY_EXPIRE_SECONDS` is fixed at 24 hours (86,400 seconds).
