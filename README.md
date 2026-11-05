# Michelle OT - Under Construction Holding Site

Ready-to-upload files for the Michelle OT holding / under-construction website.

---

## 📁 Files Included

| File | Purpose |
| :--- | :--- |
| **`index.html`** | The main landing page with black & gold branding, logo icon, holding message, and email contact link. |
| **`favicon.svg`** | Scalable vector browser tab icon featuring the gold circle and "OT" initials. |
| **`404.html`** | Branded error page if a visitor enters a broken link. |
| **`robots.txt`** | Instructs search engines (Google, Bing) not to index the site while it is under construction. |
| **`.htaccess`** | Server configuration for Apache/cPanel hosts (forces HTTPS, compresses files, enables security headers). |
| **`_redirects`** | Routing fallback for modern static hosts like Netlify or Cloudflare Pages. |

---

## 🚀 How to Upload

### Option 1: Traditional Web Hosting (cPanel / xneelo / Afrihost / Domains.co.za)
1. Log in to your hosting **cPanel** (or hosting control panel).
2. Open **File Manager**.
3. Navigate to the **`public_html`** directory (or `www` / your domain root folder).
4. Remove any existing default placeholder file (e.g. default `index.html` or `default.html` from the host).
5. Upload all the files from this folder directly into `public_html`:
   - `index.html`
   - `favicon.svg`
   - `404.html`
   - `robots.txt`
   - `.htaccess` *(Note: Files starting with a dot might be hidden in File Manager; enable "Show Hidden Files / Dotfiles" in File Manager settings if needed).*

### Option 2: FTP (FileZilla / WinSCP)
1. Connect using your FTP host, username, and password.
2. Open the remote `public_html` folder.
3. Drag and drop all files from this directory.

### Option 3: Modern Static Hosting (Netlify / Cloudflare Pages / Vercel)
- Drag and drop this folder directly into the Netlify or Cloudflare Pages dashboard.

---

## ✏️ Quick Customizations in `index.html`

- **Change Email**: Search for `info@michelleot.co.za` in `index.html` to update the email address.
- **Add a Phone or WhatsApp Button**: You can add another link inside `<div class="actions">`:
  ```html
  <a class="email" href="https://wa.me/27XXXXXXXXX" target="_blank" rel="noopener">WhatsApp Us</a>
  ```
- **When Launching the Full Site**:
  1. Replace `robots.txt` with allow directives:
     ```txt
     User-agent: *
     Allow: /
     ```
  2. Change `<meta name="robots" content="noindex, nofollow">` in your pages to `<meta name="robots" content="index, follow">`.
