let tokensEqualText
let parentTokenIDs

// Get a list of parent token IDs, slowly in series.
// We could speed this up with better use of Web3 but it's just 16 tokens that
// we could hardcode anyway.

const updateParentTokenIDs = async () => {
  let ids = []
  const numParentTokens = await tokensEqualText.totalSupply()
  for (let i = 0; i < numParentTokens; i++) {
    const childTokenID = await tokensEqualText.tokenByIndex(i)
    ids.append(childTokenID.toString(10))
  }
  parentTokenIDs = ids
}

// If the local storage isn't yet initialized, initialize it.
// If the blockchain state changed so that the local storage refers to a now
// non-existent token, default to a token that does exist.
// This will break if no tokens remain.

const ensureCurrentTokenIDValid = () => {
  const id = localStorage.getItem('currentTokenID')
  if ((parentTokenIDs == null) || (parentTokenIDs.findIndex(id) === -1)) {
    localStorage.setItem('currentTokenID', parentTokenIDs[0])
  }
}

const setTokenSelects = async () => {
  $('#token-id-select').remove()
  const currentToken = currentTokenID()
  parentTokenIDs.forEach((index, value) => {
    let selected = ""
    if (value == currentToken) {
      selected = " selected"
    }
    $(`<option value="${value}"${selected}>${value}</option>`)
      .appendTo($('#token-id-select'))
  })
}

const currentTokenID = () =>
      parseInt(localStorage.getItem('currentTokenID'))

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

const childTokenEventHandler = async (err, result) => {
  if(err) {
    console.log(err)
    return
  }
  const currentToken = currentTokenID()
  // We cache child IDs not child contracts, so this would have false
  // positives in a more complex token environment
  if (result._childTokenID == curentToken) {
    updateStrings(currentToken)
  }
}

$(document).ready(async () => {
  const json = $.getJSON('../build/contracts/TokensEqualTextERC998.json')

  const TokenEqualsText = TruffleContract(json)
  tokensEqualText = await TokensEqualText.deployed()

  await updateTokenIDs()
  ensureCurrentTokenIDValid()
  await setTokenSelects()

  tokenEqualsText.TransferChild().watch(childTokenEventHandler)

  tokenEqualsText.ReceivedChild().watch(childTokenEventHandler)

  // If we were worried about ownership
  /*
  // This also catches burns

  tokenEqualsText.Transfer()
    .watch(async (err, result) => {
      if(err) {
        console.log(err)
        return
      }
      await updateTokenIDs()
      await setTokenSelects()
      ensureCurrentTokenIDValid()
      updateStrings(currentTokenID())
    })
  */
  
  const parentTokenID = currentTokenID()

  updateStrings(parentTokenID)

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

  $('#help').fadeOut(8000)
  
})
