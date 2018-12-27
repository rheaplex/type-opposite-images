const hashes = [ 
  "6379616e20676175737369616e206e6f69736500000000000000000000000000",
  "70696e6b2f626c7565206772616469656e740000000000000000000000000000",
  "666c6174207761726d20626c75652d626c61636b000000000000000000000000",
  "6379616e2f6e61767920626c7565206772616469656e74000000000000000000"
];

const hexToColour = async hex => {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(hex))
  const hash = Array.prototype.map.call(new Uint8Array(digest), x=>(('00'+x.toString(16)).slice(-2))).join('')
  return `#${hash.substr(0,6)}`
}

$(document).ready(() => {
  $('.text').each(async (i, text) => {
    console.log(await hexToColour(hashes[i]))
    text.style.color = await hexToColour(hashes[i])
  })
})
