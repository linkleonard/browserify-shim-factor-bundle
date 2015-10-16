# Purpose
This repository's purpose is to demonstrate an issue when attempting to combine factor-bundle, browserify-shim, and bundling vendor files separately as `vendor.js`.

To reproduce, run the following:

```bash
$ npm install
$ gulp build
```

Then, open 'pages/page1.html' in your favorite browser (I tested in Chrome).

See: https://stackoverflow.com/questions/33179760/extracting-vendor-libraries-from-factor-bundle
