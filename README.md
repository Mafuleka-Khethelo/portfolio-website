Portfolio website — quick notes

This workspace contains a simple static portfolio with:

- `index.html` — main page
- `style.css` — styling
- `assets/avatar.svg` — placeholder avatar

Quick customization steps:

1. Replace contact details
   - Edit `index.html` and update the email, GitHub, and LinkedIn links.

2. Replace avatar image
   - Put a photo at `assets/avatar.png` (or change the `src` in the HTML) and keep the same filename.

3. Enable form handling
   - Contact forms post to Way2Form: `https://way2form.com/api/forms/53850bd2-396d-41ba-bebd-c320ea2ce17f/submit`
   - Notifications go to the email configured on that Way2Form form.

4. Optional font
   - The page references the Inter font via Google Fonts. If you prefer system fonts, remove the Google Fonts link in `index.html`.

5. Local preview
   - Open `index.html` in your browser (double-click or use `Start-Process .\index.html` in PowerShell).

If you want, I can:
- Swap the avatar to your real photo and set your contact links.
- Add real project screenshots and a simple modal for project details.
- Wire the contact form to Way2Form and test a submission.

Hosted sites
------------

- Clean Slate Solutions — https://cleanslatesolutions.co.za/ (live, private repository)
- Dev Workflow Tools — https://devworkflowtools.com/ (live)

Tech stack used on the hosted sites
----------------------------------

Frontend
- HTML5, CSS3, JavaScript
- Responsive design with modern UI/UX
- Professional animations and transitions

Contact form (Way2Form)
-----------------------

This site uses Way2Form for contact submissions (no backend required). Messages notify `mafulekakhethelo@gmail.com`.

```html
<script>window.WAY2FORM_ENDPOINT = 'https://way2form.com/api/forms/53850bd2-396d-41ba-bebd-c320ea2ce17f/submit';</script>
```

Image optimization
------------------

To create web-optimized screenshots (1200px wide) and WebP fallbacks, you can use ImageMagick. This small PowerShell script will read the PNG files in `assets/` and create resized PNG and WebP files.

Save and run `scripts\optimize-images.ps1` from PowerShell (requires ImageMagick `magick` in PATH):

```powershell
# Example: run from repository root
.
\scripts\optimize-images.ps1
```

Files produced:
- `assets/proj-cleanslate-1200.png`
- `assets/proj-cleanslate.webp`
- `assets/proj-devworkflow-1200.png`
- `assets/proj-devworkflow.webp`

If you'd like, I can run these steps for you and replace the assets in the repo. Otherwise run the script locally and it will generate the optimized images.

Contact form (centralized handler)
---------------------------------
This project includes a unified client-side contact handler at `scripts/contact.js`. It provides:
- Honeypot spam protection (hidden field)
- Client-side validation and accessible status messages
- Way2Form integration with automatic retries

Reload the site and submit the contact form. The status message will report success or failure.

 


