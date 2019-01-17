## HTML template renderer for Node.js Express applications


### Installation:
  npm install ezrender


### Server Overview:
  - Configure in your server.js file (or wherever you've configured Express)
  - The '/public/html' path parameter in the first 'app.set()' statement should point to the directory where your HTML templates and partials are stored

    ```javascript
    const app = express();
    const ezrender = require('ezrender');

    app.engine('html', ezrender);
    app.set('views', '/public/html');
    app.set('view engine', 'html');
    ```


### Controller Overview:
  - Input patterns are in the 'patterns' property of the 'options' parameter
  - The 'options' object has the following structure. The 'decorations' property is optional, but if present will be applied to all *{{{ patterns }}}* unless overridden by the pattern's own style. In the following example values stored in a user's cookie are being rendered.

    ```javascript
    let cookieValues = JSON.parse(req.cookies.cookie_name).cookie_properties;

    let options = {
       decorations: {
           style: '<span style="color: deeppink">@@@</span>'
       },
       patterns: {
           'email': {
               value: cookieValues['email'],
               style: '<span style="color: skyblue">@@@</span>'
           },
           'first-name': {
               value: cookieValues['first-name']
           },
           'last-name': {
               value: cookieValues['last-name'],
               style: '<span style="color: orange">@@@</span>'
           },
           'main-content': {
               value: 'This is any arbitrary content....'
           },
           'copyright-notice': {
               value: 'Copyright ME, 2019',
               style: '<span style="font-size: 100px;">@@@</span>'
           }
       }
    }

    res.render('template-file-name-without-extension', options);
    ```

  - Parameters:
    - *filePath* {string} file name to read, minus extension
    - *options* {object} input options (see description for important details)
    - *callback* {function} callback function from Express

  - Returns:
    - *callback* {function} function with rendered HTML as a parameter


### Template Overview:

  - In the template the following are matched and rendered:
    - *{{{ patterns }}}* are rendered with styles, if they have a 'style' property
    - *{{ patterns }}* are rendered without styles, even if they have a 'style' property
    - *{{% partials %}}* are filenames of partials which are imported before any other patterns are rendered
  - Base template
    - If the path is the same as in the Server Overview, the actual location would be '/public/html/template-file-name-without-extension.html'
    ```html
    {{% header %}}
    {{{ first-name }}} <input type="text" value="{{ first-name }}" />
    {{{ last-name }}} <input type="text" value="{{ last-name }}" />
    {{{ main-content }}}
    {{% footer %}}
    ```
  - Header template
    - If the path is the same as in the Server Overview, the actual location would be '/public/html/header.html'
    ```html
    {{{ email }}}
    ```
  - Footer template
    - If the path is the same as in the Server Overview, the actual location would be '/public/html/footer.html'
    ```html
    {{ copyright-notice }}
    ```
  - Rendered output:
    ```html
    <span style="color: skyblue">me@you.email</span>
    Joe <input type="text" value="Joe" />
    <span style="color: orange">Blow</span> <input type="text" value="Blow" />
    <span style="color: deeppink">This is any arbitrary content....</span>
    Copyright ME, 2019 <!-- No styling here, due to the {{ pattern }} ignoring styles -->
    ```
