# Muay Thai scoring & judging (GitHub Pages site)

This repository is a static website designed for GitHub Pages.

## Publish on GitHub Pages
1. Create a GitHub repository (for example `muaythai-judging`).
2. Upload the contents of this folder to the repository root.
3. In GitHub: **Settings → Pages**
   - Source: Deploy from a branch
   - Branch: `main` and `/ (root)`
4. Your site will appear at `https://<username>.github.io/<repo>/` (or your custom domain).

## Editing the web copy
The web copy is in the HTML files at the repository root:
- `overview.html`
- `scoring-hierarchy.html`
- `what-scores.html`
- `judging-process.html`
- `scorecards.html`
- `running-race.html`
- `rules-decisions.html`

## Practice fights
Edit `data/fights.json` and add YouTube IDs.

## Assessment area
Assessment pages are in `/assessment/`.

**Important:** GitHub Pages cannot truly password-protect content.
The included password gate is client-side and is only a deterrent.

### Change the password
Edit `assessment/config.json`:
- Replace `salt` (any string)
- Replace `hash` with SHA-256 of `salt + password`

Compute the hash (macOS/Linux):
```bash
python3 - << 'PY'
import hashlib
salt="mtj-v1"
password="newpassword"
print(hashlib.sha256((salt+password).encode()).hexdigest())
PY
```

### Real protection options (recommended)
- Put the site behind **Cloudflare Access** (path policy for `/assessment/*`)
- Host the assessment area on a platform with authentication (Netlify, an LMS, etc.)

## Styling
- CSS: `assets/css/style.css`
- JavaScript: `assets/js/main.js`
