'use strict';

/** @module */

const fs = require('fs');

exports.ezrender = (filePath, options, callback) => { 
    /**
    * HTML template renderer <br />
    * -- Input patterns are in the 'patterns' property of the 'options' parameter <br />
    * -- {{{patterns}}} are rendered with styles, if they have a 'style' property <br />
    * -- {{patterns}} are rendered without styles, even if they have a 'style' property <br />
    * -- {{%partials%}} are filenames of partials which are imported before any other patterns are rendered <br />
    * -- Express adds other properties to the 'options' object that should be ignored by the renderer <br />
    * -- The 'decorations' property can contain global characteristics <br />
    * ---- Currently only styles:default is supported <br />
    * ---- Defaults can be overridden in individual patterns <br />
    * <pre>
    * let options = {
    *    decorations: {
    *        'style': '&ltspan style="color: deeppink"&gt@@@&lt/span&gt'
    *    },
    *    patterns: {
    *        'email': {
    *            value: cookieValues['email'],
    *            style: '&ltspan style="color: skyblue"&gt@@@&lt/span&gt'
    *        },
    *        'first-name': {
    *            value: cookieValues['first-name']
    *        },
    *        'last-name': {
    *            value: cookieValues['last-name'],
    *            style: '&ltspan style="color: orange"&gt@@@&lt/span&gt'
    *        }
    *    }
    * }
    * </pre>
    * 
    * @name ezrender
    * @function
    * @param {string} filePath file name to read, minus extension
    * @param {object} options input options (see description for important details)
    * @param {function} callback callback function from Express
    * @returns {function} callback function with rendered HTML as a parameter
    */

    fs.readFile(filePath, function (err, content) {
        if (err) {
            return callback(err);
        }

        let stringifiedContent = content.toString();

        let getPartial = (file) => {
            return new Promise(resolve => { 
                let stringifiedPartial = '';
                fs.readFile(filePath.replace(/\/[^\/]*$/, '/' + file + '.html'), function (err, content) {
                    if(err){
                        resolve(err);
                    }
                    stringifiedPartial = content.toString();
                    resolve(stringifiedPartial);
                });
            });
        }

        async function goPartials(input) {
            let partialPattern = new RegExp('{{%.{0,}%}}', 'g'); //Match partials...
            let partials = [];
            let matched = '';

            while ((matched = partialPattern.exec(stringifiedContent)) != null) {
                partials.push(matched);
            }

            for (let i in partials) {
                let partialFile = partials[i][0].replace('{{%', '');
                partialFile = partialFile.replace('%}}', '');
                let newPartial = await getPartial(partialFile);
                if(newPartial.errno){
                    return newPartial; //This is now an error...
                }
                input = input.replace(partials[i][0], newPartial);
            }

            return input;
        }

        goPartials(stringifiedContent).then((response) => {
            if(response.errno){
                return callback(null, response);
            }
            
            for (let key in options.patterns) {
                let styled = new RegExp('{{{ {0,}' + key + ' {0,}}}}', 'g'); //Matches patterns to be styled...
                let unstyled = new RegExp('{{ {0,}' + key + ' {0,}}}', 'g'); //Unstyled matches...
                let value = options.patterns[key].value;
                let styledValue = value;
                if (options.decorations.style) {
                    styledValue = options.decorations.style.replace('@@@', value);
                }
                if (options.patterns[key].style) {
                    styledValue = options.patterns[key].style.replace('@@@', value)
                }
                response = response.replace(styled, styledValue);
                response = response.replace(unstyled, options.patterns[key].value);
            }
    
            return callback(null, response);
        });
    });
}