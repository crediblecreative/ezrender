HTML template renderer for Node.js Express applications

Installation:
  npm install ezrender

Server Overview:
  - Install as middleware in your server.js file
  - The '/public/html' path parameter in the first 'app.set()' statement should point to the directory where your HTML templates and partials

    ```javascript
    const app = express();
    const ezrender = require('ezrender');

    app.engine('html', ezrender);
    app.set('views', '/public/html');
    app.set('view engine', 'html');
    ```

Controller Overview:
  - Input patterns are in the 'patterns' property of the 'options' parameter
  - *{{{ patterns }}}* are rendered with styles, if they have a 'style' property
  - *{{ patterns }}* are rendered without styles, even if they have a 'style' property
  - *{{% partials %}}* are filenames of partials which are imported before any other patterns are rendered
  
  The 'options' object has the following structure. The 'decorations' property is optional, but if present will be applied to all *{{{ patterns }}}* unless overridden by the pattern's own style. In the following example values stored in a user's cookie are being rendered.

    ```javascript
    console.log(tester);
    ```

Parameters:
  - *filePath* {string} file name to read, minus extension
  - *options* {object} input options (see description for important details)
  - *callback* {function} callback function from Express

Returns:
  - *callback* {function} function with rendered HTML as a parameter