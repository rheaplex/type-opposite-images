const tokenOwnedIDs = tokenID =>
      aesthetic
      .elements
      .map(element => aesthetic[element][tokenID].substr(2))

const currentTokenID = () =>
      parseInt(localStorage.getItem('currentTokenID') || 1) - 1

const setTokenSelects = async () => {
  $('#token-id-select').empty()
  const currentToken = currentTokenID()
  for (let i = 1; i <= aesthetic.num_tokens; i++) {
    console.log(i)
    let selected = ""
    if (i == currentToken) {
      selected = " selected"
    }
    $(`<option value="${i}"${selected}>${i}</option>`)
      .appendTo($('#token-id-select'))
  }
}

$(document).ready(() => {

  setTokenSelects()
  
  const parentTokenID = currentTokenID()

  updateStrings(parentTokenID)
  updateSelect(parentTokenID)

  $('#help').fadeOut(8000)

  $('#content').click(() => $('#ui').fadeIn())

  $('#token-id-cancel').click(event => {
    event.stopPropagation()
    $('#ui').fadeOut()
  })

  $('#token-id-ok').click(event => {
    event.stopPropagation()
    localStorage.setItem('currentTokenID', $('#token-id-select').val())
    updateStrings(currentTokenID())
    $('#ui').fadeOut()
  })
  
})
