const fs = require('fs')
const process = require('process')

if (! process.cwd().endsWith('tokens-equal-text')) {
  console.log('Make sure to run this in tokens-equal-text')
  process.exit(1)
}

const NUM_TOKENS = 16;
const TOKEN_BASE = 1;

const URL_BASE = "https://robmyers.org/tokens-equal-text"

for(let i = 0; i < NUM_TOKENS; i++) {
  const tokenNum = TOKEN_BASE + i;
  fs.writeFileSync(`./metadata/${tokenNum}`,
              `{
"description": "A composable token that owns children with aesthetic IDs."
"external_url": "${URL_BASE}/${tokenNum}",
"image": "${URL_BASE}/${tokenNum}.png",
"name": "Tokens Equal Text ${tokenNum}"
}`)
}
