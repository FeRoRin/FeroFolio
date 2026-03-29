# FeroFolio

> Personal portfolio of **Firdaouss El Ouahabi** — Full-Stack Developer based in Tangier, Morocco.  
> Built with vanilla HTML · CSS · JavaScript. Zero frameworks, zero build step, deploys anywhere.

---

## 📁 Project Structure

```
FeroFolio/
├── index.html                  ← Single-page portfolio
├── README.md
│
├── assets/
│   ├── images/
│   │   ├── profile/            ← Headshots / avatars (add profile.jpg here)
│   │   └── projects/           ← Project screenshots
│   └── fonts/                  ← Self-hosted font files (optional)
│
├── styles/
│   ├── main.css                ← All custom styles
│   └── vendor/                 ← Third-party CSS (if needed in future)
│       └── .gitkeep
│
└── scripts/
    ├── main.js                 ← All custom JS (scroll, filter, theme, form)
    └── vendor/                 ← Third-party JS (if needed in future)
        └── .gitkeep
```

---

## 🚀 Quick Start

```bash
# Clone your repo
git clone https://github.com/FeRoRin/FeroFolio.git
cd FeroFolio

# Open in browser — no build step needed
open index.html
# or just double-click index.html
```

---

## ✉️ Contact Form Setup (Formspree — free, no backend)

The contact form uses **[Formspree](https://formspree.io)** to forward submissions to your Gmail.  
No server, no API keys, nothing sensitive in the repo.

### Steps

1. Go to **[formspree.io](https://formspree.io)** and sign up for a free account.
2. Click **"New Form"**, name it (e.g. "FeroFolio Contact").
3. Copy your unique endpoint — it looks like:
   ```
   https://formspree.io/f/xabcdefg
   ```
4. Open `index.html` and find the `<form>` tag in the **contact section** (~line 270):
   ```html
   <form
     id="contact-form"
     action="https://formspree.io/f/YOUR_FORMSPREE_ID"
     ...
   >
   ```
5. Replace `YOUR_FORMSPREE_ID` with your real ID:
   ```html
   <form
     id="contact-form"
     action="https://formspree.io/f/xabcdefg"
     ...
   >
   ```
6. Save and push. That's it — messages go straight to your Gmail.

### What happens on submit

| Event | Behaviour |
|---|---|
| Success | Green confirmation message shown, form resets |
| API error | Red error message shown with Formspree's reason |
| Network error | Red error shown, button re-enabled |
| Not configured | Warning shown (won't fire in production once set up) |

### Security notes

- ✅ Your Gmail address is **never** in the repo — only the Formspree endpoint
- ✅ Honeypot field (`_gotcha`) catches most bots silently
- ✅ Formspree provides reCAPTCHA and spam filtering on their end
- ✅ Safe to commit — endpoint ID is public by design (like a contact form URL)

---

## 🌗 Light / Dark Mode

The theme toggle button (🌙 / ☀️) lives fixed at the bottom-right corner.  
Preference is saved in `localStorage` under the key `fero-theme` and persists across visits.

---

## 🎨 Color Palette

| Token | Dark mode | Light mode | Usage |
|---|---|---|---|
| `--accent` | `#FF3E9B` | `#FF3E9B` | Primary CTA, highlights, active states |
| `--accent2` | `#66D0BC` | `#3A8B95` | Secondary, teal accents |
| *(gradient)* | `#FF88BA` | — | Skill bar fade |
| `--bg` | `#0d1214` | `#faf5f8` | Page background |
| `--text` | `#f0ede8` | `#1a1020` | Body text |

---

## 🌐 Deployment

### GitHub Pages (recommended — free)

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Set source to **Deploy from a branch → `main` / `root`**.
4. Your site will be live at `https://ferorin.github.io/FeroFolio/`

### Netlify (drag & drop)

1. Go to [netlify.com](https://netlify.com).
2. Drag the `FeroFolio/` folder into the deploy zone.
3. Done — custom domain available in settings.

### Vercel

```bash
npm i -g vercel
vercel
```

---

## 🛠 Customisation Checklist

- [ ] Replace `YOUR_FORMSPREE_ID` in `index.html` with your real Formspree endpoint
- [ ] Update your email address in the contact section of `index.html`
- [ ] Add a profile photo to `assets/images/profile/` and reference it if desired
- [ ] Add project screenshots to `assets/images/projects/`
- [ ] Update social links (LinkedIn, GitHub, Telegram) in `index.html`
- [ ] Swap Google Fonts CDN with self-hosted files in `assets/fonts/` for full offline support

---

## 📄 License

MIT — use freely, credit appreciated.

---

*Built with care in Tangier 🇲🇦*
