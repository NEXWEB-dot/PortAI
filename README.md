# PortAi — AI Portfolio Builder

**Live app (just open this link):**  
https://nexweb-dot.github.io/PortAI/

No install. No download. Upload your resume or start chatting.

---

## For visitors

1. Open the link above
2. Upload a PDF resume or describe yourself
3. Say **"generate my portfolio"**
4. View and export your landing page

---

## For the site owner (one-time setup)

### 1. Enable GitHub Pages

- Repo → **Settings → Pages → Build and deployment**
- Source: **GitHub Actions**

### 2. Add your Gemini API key (powers AI for all users)

- Repo → **Settings → Secrets and variables → Actions**
- **New repository secret**
- Name: `GEMINI_API_KEY`
- Value: your key from [Google AI Studio](https://aistudio.google.com/apikey)

### 3. Deploy

Push to `main`. GitHub Actions builds the site and publishes it automatically.

---

## Local development (optional, owner only)

```bash
cp .env.example .env.local
# Add NEXT_PUBLIC_GEMINI_API_KEY=your_key to .env.local
npm install
npm run build
npm run preview
```

This is only for testing before you push — **your users never need this.**
