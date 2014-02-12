### Concept ###

As soon as the Scoreflex object is initialized, a scoreflex player is made
available. By default, the player is considered as a guest, but the player may
also logs into the Scoreflex service.

A player being anonymous or not, the `Player` object is useful to get details
on him or her. In particular you can
- Display nicknames.
- Display profiles.
- Display avatars.

### Getting a Player object ###

`Player` objects are available in various ways.

The `Scoreflex.Players.get` method is useful to get a `Player` from a
`playerId`.

````javascript
var scoreflex = new Scoreflex(/* ... */);
var playerId = "0123456789abcdef";
var player = scoreflex.Players.get(playerId);
````

You can also get the current player.

````javascript
var currentPlayer = scoreflex.Players.getCurrent();
````

By listening to the `ScoreflexPlayerEvent`, you can also being informed of 
player logins and player logouts. Listening to this event enable to change a 
displayed nickname for instance.

````javascript
var scoreflexEventHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === 'player') {
    var currentPlayer = detail.player;
  }
};
window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);
````

Other ways to get `Player` objects is to call the `getPlayers()` method from a
`ChallengeInstance` object or to instantiate `Player` object from playerIds 
for instance. 
