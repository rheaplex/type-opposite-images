let tokensEqualText
let parentTokenIDs

const updateParentTokenIDs = async () => {
  let ids = []
  const numParentTokens = await tokensEqualText.totalSupply()
  for (let i = 0; i < numParentTokens; i++) {
    const childTokenID = await tokensEqualText.tokenByIndex(i)
    ids.append(childTokenID.toString(10))
  }
  parentTokenIDs = ids
}

const setTokenSelects = async () => {
  $('#token-id-select').remove()
  parentTokenIDs.forEach((index, value) => {
    $(`<option value="${value}">${value}</option>`)
      .appendTo($('#token-id-select'))
  })
}

const currentTokenID = () =>
      parseInt(localStorage.getItem('currentTokenID') || parentTokenIDs[0])

const tokenOwnedIDs = async tokenID => {
  let IDs = []
  // Get children of ID from contract
  const childContractCount = await tokensEqualText.totalChildContracts()
  for(let i = 0; i < childContractCount; i++) {
    const childContract = await tokensEqualText.childContractByIndex()
    const childTokenCount
          = await tokensEqualText.totalChildTokens(tokenID, childContract)
    for(let j = 0; j < childTokenCount; j++) {
      const childID = await tokensEqualText.childTokenByIndex(tokenId,
                                                              childContract,
                                                              j)
      // These may not be unique but that's not a problem, we are using them
      // as content not identifiers
      IDs.append(childID.toString(16))
    }
  }
  return IDs
}

$(document).ready(async () => {

  const TokenEqualsText = TruffleContract('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  tokensEqualText = await TokensEqualText.deployed()

  await updateTokenIDs()
  
  await setTokenSelects()

  // Event handler to update display
  // Event handler to update parentTokenIDs
  
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
