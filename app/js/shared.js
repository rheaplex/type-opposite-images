const hexToString = hex => {
  let str = ''
  for (let i = 0; i < hex.length; i += 2) {
	str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  }
  return str
}

const hexToColour = async hex => {
  const digest = await window.crypto.subtle.digest('SHA-256',
                                                   new TextEncoder()
                                                   .encode(hex))
  const hash = Array.prototype.map.call(new Uint8Array(digest),
                                         x=>(('00'+x.toString(16))
                                             .slice(-2))).join('')
  return `#${hash.substr(0,6)}`
}

const idsToStrings = (hexIDs) => hexIDs.map(hexToString)

const idsToColours = (hexIDs) => hexIDs.map(hexToColour)

const updateSelect = (parentTokenID) => {
  $('option').attr('selected', null)
  $(`option[value=${parentTokenID + 1}]`).attr('selected', true)
}

const updateStrings = async (parentTokenID) => {
  const ids = tokenOwnedIDs(parentTokenID)
  const strings = idsToStrings(ids)
  const colours = await Promise.all(idsToColours(ids))
  $('.text').remove()
  for(let i = 0; i < ids.length; i++) {
    $('#texts').append(`<div class="text" style="color: ${colours[i]};">${strings[i]}</div>`)
  }
}
