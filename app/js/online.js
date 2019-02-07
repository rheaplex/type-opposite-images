let tokensEqualText
let parentTokenIDs

// Get a list of parent token IDs, slowly in series.
// We could speed this up with better use of Web3 and promise handling
// but it's just 16 tokens that  we could hardcode anyway.

const updateParentTokenIDs = async () => {
  let ids = []
  const supply = await tokensEqualText.totalSupply()
  const numParentTokens = web3.toDecimal(await tokensEqualText.totalSupply())
  for (let i = 0; i < numParentTokens; i++) {
    const tokenID = await tokensEqualText.tokenByIndex(i)
    ids.push(tokenID.toString(10))
  }
  parentTokenIDs = ids
}

// If the local storage isn't yet initialized, initialize it.
// If the blockchain state changed so that the local storage refers to a now
// non-existent token, default to a token that does exist.
// This will break if no tokens remain.

const ensureCurrentTokenIDValid = () => {
  const id = localStorage.getItem('currentTokenID')
  if ((parentTokenIDs == null)
      || (parentTokenIDs.findIndex(i => i == id) === -1)) {
    localStorage.setItem('currentTokenID', parentTokenIDs[0])
  }
}

const setTokenSelects = async () => {
  $('#token-id-select').empty()
  const currentToken = currentTokenID()
  parentTokenIDs.forEach(value => {
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
  const childContractCount = await tokensEqualText.totalChildContracts(tokenID)
  for(let i = 0; i < childContractCount; i++) {
    const childContract = await tokensEqualText.childContractByIndex(tokenID, i)
    const childTokenCount
          = await tokensEqualText.totalChildTokens(tokenID, childContract)
    for(let j = 0; j < childTokenCount; j++) {
      const childID = await tokensEqualText.childTokenByIndex(tokenID,
                                                              childContract,
                                                              j)
      // These may not be unique but that's not a problem, we are using them
      // as content not identifiers
      IDs.push(childID.toString(16))
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

const maybeSetTokenFromHash = () => {
  let status = true
  const tokenFromURLHash = new URL(document.location).hash.substr(1)
  if (tokenFromURLHash !== "") {
    const tokenNum = parseInt(tokenFromURLHash, 10)
    if ((tokenNum < 1)
        || (tokenNum > parentTokenIDs.length)) {
      $('#help').text('No such token.')
      status = false
    } else {
      localStorage.setItem('currentTokenID', tokenFromURLHash)
    }
  }
  return status
}

$(document).ready(async () => {
  const helpText = $('#help').text()
  $('#help').text('Loading resources from Ethereum.')
  const json = await $.getJSON('../build/contracts/TokensEqualTextERC998.json')

  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider)
  } else {
    // Set the provider you want from Web3.providers
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  }
  const TokensEqualText = TruffleContract(json)
  TokensEqualText.setProvider(web3.currentProvider)
  tokensEqualText = await TokensEqualText.deployed()

  await updateParentTokenIDs()
  $('#help').text(helpText)
  let ok = maybeSetTokenFromHash()
  if (! ok) {
    return
  }
  ensureCurrentTokenIDValid()
  await setTokenSelects()

  //tokensEqualText.TransferChild().watch(childTokenEventHandler)

  //tokensEqualText.ReceivedChild().watch(childTokenEventHandler)

  // If we were worried about ownership
  /*
  // This also catches burns

  tokensEqualText.Transfer()
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
