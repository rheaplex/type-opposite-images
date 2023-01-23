/*
  The functions to map text and colours from hex are copied and pasted.
  As are the html and css.
*/

const crypto = require('crypto');

// Make sure to have the very latest wkhtmltopdf installed
const wkhtmltopdf = require('wkhtmltopdf');

const aesthetic = require('../aesthetic/aesthetic.js');
const citehtsea = require('../aesthetic/citehtsea.js');

// Copy and paste antipattern

const hexToString = hex => {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    let a = String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    // Avoid trailing nulls, these break `` apart from anything else
    // We could also have used the first null pos as the loop boundary
    if (a === "\0") {
      break;
    }
	  str += a;
  }
  return str;
};

const strToColour = str => {
  const hash = crypto.createHash('sha256');
  hash.update(str);
  return '#' + hash.digest('hex').substr(0,6);
};

for(let i = 0; i < aesthetic.num_tokens; i++) {
  console.log(`${i + 1} ----------------------------------------`);
  let lines = aesthetic.elements.map(element => {
    // Get element, strip leading '0x'
    const item = citehtsea[aesthetic[element][i]].substr(2);
    const text = hexToString(item);
    console.log(text);
    //const colour = strToColour(item);
    return `      <div class="text">${text}</div>`;
  }).join("\n");
  console.log("");
  // Copy and paste antipattern
  const html =
        // wkhtmltopdf version. Dated html but much better colours.
        `<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Type Opposite Images ${i + 1}</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html {
        line-height: 1.15;
        height: 100%;
        background: black;
      }

      body {
        height: 100%;
        padding: 0px;
        margin: 0px;
        overflow: hidden;
        transform: scale(-1, 1);
      }

      #wrapper {
        display: table;
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
      }

      #content {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
       }

      #texts {
        display: inline-block;
        text-align: left;
      }

      .text {
        font-size: 482.316pt; /* px value but points unit for wkhtmltopdf */
        font-family: 'Helvetica Now Text', Sans-Serif;
        font-weight: bold;
        white-space: nowrap;
        color: white;
      }
    </style>
  </head>
  <body>
    <div id="wrapper">
      <div id="content">
        <div id="texts">
${lines}
        </div>
      </div>
    </div>
  </body>
</html>
`;
  wkhtmltopdf(html, {
    pageWidth:  '7680px',
    pageHeight: '4320px',
    marginBottom: '0px',
    marginLeft: '0px',
    marginRight: '0px',
    marginTop: '0px',
    minimumFontSize: '480',
    output: `./pdfs/${i + 1}.pdf`,
  });
}
