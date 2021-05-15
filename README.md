# Welcome to Unstable Unicorns

This is an online game variant of Unstable Unicorns. All you need is a browser and some friends to play with you.

**Demo:** [unstable-unicorns-online.herokuapp.com/:matchID/:numOfPlayers/:playerID](unstable-unicorns-online.herokuapp.com/)

To create a game type the following url into your browser

 `unstable-unicorns-online.herokuapp.com/hello-world/6/0`

This will create a game with match id `hello-world` for `6` players. You will enter the game as a player with id `0`.

To play with your friends, share the link
 `unstable-unicorns-online.herokuapp.com/hello-world/6/PLAYER_ID`
 with your friends where you replace `PLAYER_ID` with a number from 0 to 5. Each of your friends including you should receive a unique player id. 

## Current State

It is *playable*! However, sometimes you can get stuck in the game, e.g. when a player needs to discard a card but that player has no cards on their hand. For that, there are invisible buttons in the left top corner and right top corner. Clicking the invisible button in the right top corner will end the turn of the current player; the other button in the left top corner will end the current action scene of the player. The section *Implementation Details* will contain more information what an action scene is but for now it is incomplete. I will update it later if I have time.

## Implementation Details

This game was developed using [boardgame.io](boardgame.io) and Typescript.

*To-Do: describe architecture, etc...*

## To-Do

 - not all cards have been implemented yet (~90% finished) 
 - drag and drop 
 - make the game more interactive
 - UI...
 - etc...

