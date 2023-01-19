const fs = require('fs');

const NUM_TOKENS = 32;
const TOKEN_BASE = 1;

const IMG_URL_BASE =
      "ipfs://";
const SHOW_URL_BASE =
      "https://show.rhea.art/type-opposite-images/app/index.html";

for(let i = 0; i < NUM_TOKENS; i++) {
  const tokenNum = TOKEN_BASE + i;
  const filePath = `./metadata/${tokenNum}`;
  fs.writeFileSync(
    filePath,
    `{
"description": "The evil twin of 'Tokens Equal Text ${tokenNum}'.",
"external_url": "${SHOW_URL_BASE}#${tokenNum}",
"image": "${IMG_URL_BASE}/${tokenNum}.png",
"name": "Type Opposite Images ${tokenNum}"
}`
  );
}
