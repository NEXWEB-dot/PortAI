# PortAi — AI Portfolio Builder

A static portfolio builder that runs entirely in the browser. No server needed — deploy to GitHub Pages and open the site like a normal website.

## Features

- ChatGPT-style builder UI with dark/light mode
- PDF resume upload (parsed in your browser)
- Gemini AI chat and portfolio generation
- Skill-driven design guidelines (no generic AI slop)
- Live preview + JSON export

## Quick start (local preview)

```bash
npm install
npm run build
npm run preview
```

Open the URL shown (usually `http://localhost:3000`). This serves the static `out/` folder — the same files GitHub Pages will host.

## GitHub Pages deploy

1. Push this repo to GitHub (e.g. `yourusername/PortAi`)
2. Go to **Settings → Pages → Build and deployment**
3. Set source to **GitHub Actions**
4. Push to `main` — the workflow builds and deploys automatically
5. Your site will be live at: `https://yourusername.github.io/PortAi/`

## API key (required for AI)

1. Get a free key from [Google AI Studio](https://aistudio.google.com/apikey)
2. Open the site and click **Add API Key** in the header
3. Your key is stored only in your browser (localStorage)

No `.env` file or server setup needed.

## Usage

1. Add your Gemini API key
2. Upload a PDF resume or describe yourself in chat
3. Say **"generate my portfolio"**
4. Toggle **Show preview** to see results
5. Open full page or export JSON

## Project structure

```
out/                  # Static site after build (deploy this)
app/portfolio/        # Public portfolio page (?id=...)
components/builder/   # Chat UI
lib/ai/               # Client-side Gemini calls
.github/workflows/    # Auto-deploy to GitHub Pages
```

## Custom base path

If your repo name isn't `PortAi`, set before build:

```bash
NEXT_PUBLIC_BASE_PATH=/YourRepoName npm run build
```

The GitHub Action sets this automatically from your repo name.

## Note on opening `index.html` directly

Browsers block some features when opening files via `file://`. Use **GitHub Pages** or `npm run preview` to serve the `out/` folder over HTTP.
