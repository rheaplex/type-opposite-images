/*  Type Opposite Images - Tokens Equal Text's evil twin.
    Copyright (C) 2023 Myers Studio Ltd.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


import { ethers } from "./ethers.js";

export const toText = (text) => {
  return ethers.utils.toUtf8String(text);//.replace(/\0+$/, "");
};

export const ensureTokenId = (numEditions, defaultTokenId) => {
  const id = window.location.hash.substr(1);
  if (id < 1 || id > numEditions) {
    // Reload the page with a working token id
    window.location.replace(window.location.pathname + `#${defaultTokenId}`);
  }
  return ethers.BigNumber.from(id);
};

export const initNetwork = async (contractName) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Just reload the window if the network changes
  provider.on('chainChanged', (chainId) => { window.location.reload(); });
  const chainName = await provider.getNetwork().name;
  const contractPath = `./js/${contractName}.json`;
  const response = await fetch(contractPath);
  const json = await response.json();
  const contract = new ethers.Contract(
    json.networks[(await provider.getNetwork()).chainId].address,
    json.abi,
    provider
  );
  return [ provider, contract ];
};

let NUM_EDITIONS = 32;
let DEFAULT_TOKEN_ID = 1;

let provider;
let contract;
let tokenId;

const displayToken = async () => {
  const texts = document.getElementById("texts");
  (await contract.aestheticToCitehtsea(tokenId)).forEach(text => {
    var div = document.createElement("div");
    div.className = "text";
    div.innerHTML = toText(text);
    texts.append(div);
  });
};

const main = async (event) => {
  [ provider, contract ] = await initNetwork("TypeOppositeImages");

  tokenId = ensureTokenId(NUM_EDITIONS, DEFAULT_TOKEN_ID);

  await displayToken();

/*  const status = contract.filters.Status(
    tokenId,
    null
  );

  contract.on(status, (id, is_art) => {
    setDisplayState(is_art);
  });*/

};

window.addEventListener("DOMContentLoaded", main);
window.addEventListener('hashchange', () => window.location.reload(), false);
