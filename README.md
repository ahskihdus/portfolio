# Sudhiksha Sadige — Portfolio

Personal portfolio website with a retro pixel-art aesthetic, built with pure HTML, CSS, and JavaScript.

## Live Site

Once deployed: `https://ahskihdus.github.io/portfolio/`

## Features

- 8-page static site (Home, About, Experience, Projects, Leadership, Skills, Resume, Contact)
- Retro pixel-art design with purple/blue color palette
- Live GitHub API integration (repos, stats, contribution graph)
- Interactive skill bars with scroll-triggered animations
- Pixel particle background effects
- Custom pixel cursor
- Easter eggs: Konami Code (confetti), type "sudo" (terminal mode), press "?" (keyboard hints)
- Print-optimized resume page
- SEO metadata, Open Graph tags, and structured data
- Fully responsive (mobile, tablet, desktop)

## Run Locally

No build step needed. Open any HTML file directly in a browser:

```bash
# Option 1: Open directly
open index.html

# Option 2: Use a local server (recommended for proper relative paths)
npx serve .

# Option 3: Python server
python -m http.server 8000

# Option 4: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## Deploy to GitHub Pages

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "Add portfolio site"
git push origin main
```

### Step 2: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Select **main** branch, **/ (root)** folder
5. Click **Save**
6. Wait 1-2 minutes — your site will be live at `https://ahskihdus.github.io/portfolio/`

### Custom Domain (Optional)

1. Add your domain to the **Custom domain** field in GitHub Pages settings
2. Update the `CNAME` file with your domain
3. Configure DNS with your domain registrar:
   - `A` records pointing to GitHub Pages IPs
   - Or `CNAME` record pointing to `ahskihdus.github.io`

## Project Structure

```
├── index.html          # Home page
├── about.html          # About page
├── experience.html     # Experience timeline
├── projects.html       # Featured projects + GitHub repos
├── leadership.html     # Leadership & activities
├── skills.html         # Interactive skill bars
├── resume.html         # Printable resume
├── contact.html        # Contact info & form
├── css/
│   ├── global.css      # Design system, nav, footer, shared components
│   ├── home.css        # Home page styles
│   ├── about.css       # About page styles
│   ├── experience.css  # Timeline styles
│   ├── projects.css    # Project cards
│   ├── leadership.css  # Leadership cards
│   ├── skills.css      # Skill bars and blocks
│   ├── resume.css      # Resume layout + print styles
│   └── contact.css     # Contact form and cards
├── js/
│   ├── global.js       # Navigation, pixel cursor
│   ├── github.js       # GitHub API integration
│   ├── particles.js    # Pixel particle animation
│   ├── skills.js       # Skill bar animations
│   └── easter-eggs.js  # Konami code, terminal, hints
├── assets/
│   └── favicon.png     # Pixel-art favicon
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Search engine config
└── README.md           # This file
```

## Customization

- **Colors**: Edit CSS variables in `css/global.css` under `:root`
- **Content**: Edit the HTML files directly
- **GitHub username**: Change `GITHUB_USERNAME` in `js/github.js`
- **Contact form**: Replace the Formspree URL in `contact.html` with your own endpoint, or use `mailto:` links
- **Resume**: The print button uses `window.print()` — save as PDF from the browser's print dialog

## Tech Stack

- HTML5
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (ES6+)
- GitHub REST API
- Google Fonts (Press Start 2P, Inter)
