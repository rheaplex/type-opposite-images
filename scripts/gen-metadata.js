const fs = require('fs')
const process = require('process')

const NUM_TOKENS = 32;
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
