This is making nft section
-  node src/scripts/uploadAndSaveSkins.js (this is to upload to pinata and store url into neon console)
- npm run build (update dist to what you change in src)
- node dist/generator.js (making the .json)
- node dist/imageGenerator.js (make nft image .png)
- npm run generate (combine all 3 above)
note: make sure their is an empty skins folder in dist before making the .json.
