## Checkers bot
This is a checkers bot designed to work with [Discord](https://discordapp.com/), a chat and audio app where can gamers communicate (Slack for gamers).
It's built using the node.js library, [discord.js](https://discord.js.org/)

## Game structure
The bot uses emojies to show the black pieces (⚫), white pieces(⚪). However due to the limitations of this, white king pieces (🔵) and black king pieces (🔴), aren't easily deductible.
Each square has a coordinate that can be readable from the table the bot generates. Along the vertial axis are letters and along the horizontal are numbers. 
It is currently only coded to generate an 8x8 board.

## Commands
To interact with the bot, it will try to read any command in the chat starting with `!cb`, e.g. `!cb move c2 to d4`
* Starting a game
  * Starting a game with someone else `!cb start game with @*Player's name*`
  * The other player needs to accept the invitation with `!cb accept`
  * You can start a game with yourself by `!cb start game with myself` to practice. This doesn't require another person and will print the game automatically.
* Moving pieces
  * It is assumed the game which you want the piece to move is your primary game. To switch this see the "Switching games" section below
  * Unless your piece was crowned a king, the black pieces can only be moved down, and the whites pieces up with `!cb move *coordinates of piece* to *intended place you wish the piece to be*`
  * If there is a piece you wish to jump, specify for the second coordinate the square where your piece will land after it has jumped the opponent's. If there is a double jump opportunity, the next jump will be automatically down for you. If you there are multiple places where you can double jump, the system will respond and ask you in which direction you wish to move.
* Switching games
  * To view the games you have with multiple people you can type `!cb my games`
  * To switch your primary game type `!cb switch game *game number*`
  
  More in-depth explanations and examples can be found by [visiting the discord server here](https://discord.gg/Qbfqbxa).
