NOTES
=====

Token Creation Gas
------------------

Bulk NFT token generation is costly. We can create the ERC721 tokens in the
contract constructor but we run out of gas if the contract implements
ERC721Enumerable. Creating ERC998 tokens in the constructor is possible for
at most a couple of tokens before we run out of gas. So constructors are not
the right location for token creation in this scenario.

I tried a builder contract that acted as a migration proxy. It would create the
contracts then create the tokens en masse but that proved to be over-engineered
and cause problems with msg.sender based access control.

For the amount of tokens that needed creating and composing for this project
the correct solution turned out to be adding access controlled batch token
creation functions to the ERC721 and ERC998 contracts and creating and
attaching the tokens (in batches) during migration.
