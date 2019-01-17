HTML template renderer for Node.js Express applications


Installation:
  npm install ezrender


Server Overview:
  - Configure in your server.js file (or wherever you've configured Express)
  - The '/public/html' path parameter in the first 'app.set()' statement should point to the directory where your HTML templates and partials are stored

    ```javascript
    const app = express();
    const ezrender = require('ezrender');

    app.engine('html', ezrender);
    app.set('views', '/public/html');
    app.set('view engine', 'html');
    ```


Controller Overview:
  - Input patterns are in the 'patterns' property of the 'options' parameter
  - The 'options' object has the following structure. The 'decorations' property is optional, but if present will be applied to all *{{{ patterns }}}* unless overridden by the pattern's own style. In the following example values stored in a user's cookie are being rendered.

  ```javascript
    let cookieValues = JSON.parse(req.cookies.cookie_name).cookie_properties;

    let options = {
       decorations: {
           style: '&ltspan style="color: deeppink"&gt@@@&lt/span&gt'
       },
       patterns: {
           'email': {
               value: cookieValues['email'],
               style: '&ltspan style="color: skyblue"&gt@@@&lt/span&gt'
           },
           'first-name': {
               value: cookieValues['first-name']
           },
           'last-name': {
               value: cookieValues['last-name'],
               style: '&ltspan style="color: orange"&gt@@@&lt/span&gt'
           }
       }
    }

    res.render('template-file', options);
  ```

  - Parameters:
    - *filePath* {string} file name to read, minus extension
    - *options* {object} input options (see description for important details)
    - *callback* {function} callback function from Express

  - Returns:
    - *callback* {function} function with rendered HTML as a parameter


Template Overview:

  - In the template the following are matched and rendered:
    - *{{{ patterns }}}* are rendered with styles, if they have a 'style' property
    - *{{ patterns }}* are rendered without styles, even if they have a 'style' property
    - *{{% partials %}}* are filenames of partials which are imported before any other patterns are rendered