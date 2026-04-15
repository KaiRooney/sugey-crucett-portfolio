# Sugey Crucett Portfolio

Static portfolio website for Sugey Crucett, built with HTML, CSS, JavaScript, and editable JSON content.

## Files

- `index.html` - page structure
- `styles.css` - responsive design
- `script.js` - dynamic rendering, language toggle, contact form behavior
- `data.json` - editable portfolio content in English and Spanish
- `assets/` - portrait and resume download file

## Deploy To GitHub Pages

1. Create a new public GitHub repository.
2. Upload all files from this folder to the repository root:
   - `.nojekyll`
   - `README.md`
   - `index.html`
   - `styles.css`
   - `script.js`
   - `data.json`
   - `assets/`
3. In GitHub, open the repository settings.
4. Go to **Pages**.
5. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
6. Save.

GitHub will publish the site at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY-NAME/
```

## Editing Content

Most portfolio edits can be made in `data.json`.

Update:

- `profile` for contact details, hero image, and resume file
- `content.en` for English content
- `content.es` for Spanish content
- `experience` for job cards
- `skills` for skill chips
- `credentials.items` for certifications and education

After editing `data.json`, commit the change to GitHub and Pages will update automatically.
