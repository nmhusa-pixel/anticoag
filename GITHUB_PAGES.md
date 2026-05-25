# Hosting This App on GitHub Pages

This app is already structured for GitHub Pages because `index.html` is in the project root.

## 1. Create the GitHub repository

1. Go to https://github.com/new.
2. Create a new repository, for example `anticoagulant-hold-app`.
3. Public is simplest for free GitHub Pages. Private repositories can also use Pages depending on your GitHub plan.
4. Do not worry if the repository starts empty.

## 2. Upload the app files

Upload these files and folders to the repository root:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `sw.js`
- `.nojekyll`
- `assets/`
- `README.md`

Optional folders:

- `android/`
- `ios/`
- `tools/`

Those optional folders are not needed for the web app to run.

## 3. Turn on GitHub Pages

1. Open the repository on GitHub.
2. Go to `Settings`.
3. In the left sidebar, open `Pages`.
4. Under `Build and deployment`, set `Source` to `Deploy from a branch`.
5. Under `Branch`, choose `main` and `/ (root)`.
6. Click `Save`.

GitHub will publish the site at a URL like:

```text
https://YOUR-GITHUB-USERNAME.github.io/anticoagulant-hold-app/
```

Publishing can take a few minutes after the first save or after later pushes.

## 4. Install on phones

After the GitHub Pages URL works:

- iPhone/iPad: open the URL in Safari, tap Share, then `Add to Home Screen`.
- Android: open the URL in Chrome, open the menu, then choose `Install app` or `Add to Home screen`.

After the first successful load, the service worker caches the app shell for offline use.

## 5. Update the app later

Edit or replace files in the GitHub repository. GitHub Pages republishes after the change is pushed or committed.

If users already installed the app, they may need to close and reopen it once or twice to pick up the new cached version. If a change is urgent, update `CACHE_NAME` in `sw.js`.
