# Deploy Fixed Apps Script

## Steps to deploy:

1. Open the Google Apps Script project that corresponds to the current web app URL:
   https://script.google.com/macros/s/AKfycby78AqtoHPwc6rHsXcUJduP83OIMw2HM4QIohdhMOsTwKSTeuANi6hUrCweqmswTPbO/exec

2. Open the script file that contains the `uploadFileToDrive` function (likely `apps-script-new.js` or similar).

3. Replace the `uploadFileToDrive` function with the fixed version from `apps-script-fixed.js`.

   Specifically, replace this buggy code:
   ```javascript
   let folder = root.getFoldersByName(category).next()
   if (!folder) {
     folder = root.createFolder(category)
   }
   ```

   With this fixed code:
   ```javascript
   let folder = null
   const folders = root.getFoldersByName(category)
   if (folders.hasNext()) {
     folder = folders.next()
   }
   if (!folder) {
     folder = root.createFolder(category)
   }
   ```

4. Also update the `uploadFileToDrive` function to strip data URL prefixes from base64 strings:
   ```javascript
   function uploadFileToDrive(base64Data, fileName, mimeType, category) {
     let cleanBase64 = base64Data
     if (cleanBase64.includes(',')) {
       cleanBase64 = cleanBase64.split(',')[1]
     }
     
     const blob = Utilities.newBlob(Utilities.base64Decode(cleanBase64), mimeType || "application/octet-stream", fileName)
     // ... rest of the function
   }
   ```

5. Save the project (File > Save).

6. Deploy a new version:
   - Click "Deploy" > "New deployment"
   - Select "Web app"
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the new web app URL

7. Share the new web app URL with me so I can update the test scripts and verify the upload works.

## Alternative: Deploy the entire fixed file

If the file structure matches, you can also:
1. Open the script file in the Apps Script editor
2. Delete the existing content
3. Copy the entire content from `apps-script-fixed.js`
4. Paste it into the Apps Script editor
5. Save and deploy as a new web app
