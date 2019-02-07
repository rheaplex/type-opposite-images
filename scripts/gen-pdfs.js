/*
  The functions to map text and colours from hex are copied and pasted.
  As are the html and css.
*/


// npm install -g pm2
/*
pm2 start chromium \
  --interpreter none \
  -- \
  --headless \
  --disable-gpu \
  --disable-translate \
  --disable-extensions \
  --disable-background-networking \
  --safebrowsing-disable-auto-update \
  --disable-sync \
  --metrics-recording-only \
  --disable-default-apps \
  --no-first-run \
  --mute-audio \
  --hide-scrollbars \
  --remote-debugging-port=9222
*/

const crypto = require('crypto')
//const htmlPdf = require('html-pdf-chrome');

// Make sure to have the very latest wkhtmltopdf installed
const wkhtmltopdf = require('wkhtmltopdf')

const aesthetic = require('../aesthetic/aesthetic.js')

const options = {
  port: 9222, // port Chrome is listening on
  printOptions: {
    landscape: true,
  },
}

// Copy and paste antipattern

const hexToString = hex => {
  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
    let a = String.fromCharCode(parseInt(hex.substr(i, 2), 16))
    // Avoid trailing nulls, these break `` apart from anything else
    // We could also have used the first null pos as the loop boundary
    if (a === "\0") {
      break
    }
	str += a
  }
  return str
}

const strToColour = str => {
  const hash = crypto.createHash('sha256')
  hash.update(str)
  return '#' + hash.digest('hex').substr(0,6)
}

for(let i = 0; i < aesthetic.num_tokens; i++) {
  let lines = aesthetic.elements.map(element => {
    // Get element, strip leading '0x'
    const item = aesthetic[element][i].substr(2)
    const text = hexToString(item)
    const colour = strToColour(item)
    return `      <div class="text" style="color: ${colour};">${text}</div>`
  }).join("\n")
  // Copy and paste antipattern
  const html =
        // wkhtmltopdf version. Dated html but much better colours.
        `<!doctype html>
<html class="no-js" lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Tokens Equal Text ${i + 1}</title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      html {
        line-height: 1.15;
        height: 100%;
      }

      body {
        margin: 0;
        height: 100%;
        overflow: hidden;
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
        font-family: 'Old Standard TT', serif;
        font-weight: 700;
        font-style: normal;
        font-size: 32px;
        letter-spacing: -0.075em;
        text-transform: uppercase;
        white-space: nowrap;
      }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Old+Standard+TT:400,700" rel="stylesheet"> 
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
`
        // html-pdf-chrome version
        /*`<!doctype html>
<html class="no-js" lang="">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Tokens Equal Text ${i + 1}</title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
html {
  line-height: 1.15;
   height: 100vh;
}

body {
  margin: 0;
  height: 100vh;
  overflow: hidden;
}

#content {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#texts {
}

.text {
  font-family: 'Old Standard TT', serif;
  font-weight: 700;
  font-style: normal;
  font-size: 32px;
  letter-spacing: -0.075em;
  text-transform: uppercase;
  white-space: nowrap;
}
  </style>
  <link href="https://fonts.googleapis.com/css?family=Old+Standard+TT:400,700" rel="stylesheet"> 
</head>
<body>
   <div id="content">
     <div id="texts">
${lines}
     </div>
   </div>
</body>
</html>`
*/
  //console.log(html)
  //htmlPdf.create(html, options).then(pdf => pdf.toFile(`./pdfs/${i + 1}.pdf`))
  wkhtmltopdf(html, {
    pageSize: 'letter',
    orientation: 'landscape',
    output: `./pdfs/${i + 1}.pdf`,
  })
}
