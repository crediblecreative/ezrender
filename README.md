HTML template renderer 
  - Input patterns are in the 'patterns' property of the 'options' parameter
  - {{{ patterns }}} are rendered with styles, if they have a 'style' property
  - {{ patterns }} are rendered without styles, even if they have a 'style' property
  - {{ %partials %}} are filenames of partials which are imported before any other patterns are rendered
  
  The 'options' object has the following structure. The 'decorations' property is optional, but if present will be applied to all {{{ patterns }}} unless overridden by the pattern's own style. In the following example values stored in a user's cookie are being rendered.

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

@param {string} filePath file name to read, minus extension
@param {object} options input options (see description for important details)
@param {function} callback callback function from Express
@returns {function} callback function with rendered HTML as a parameter