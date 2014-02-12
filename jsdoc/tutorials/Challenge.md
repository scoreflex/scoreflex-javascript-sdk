### Concept ###

As soon as a challenge is configured into your Scoreflex account, using 
challenges becomes possible. The word challenge is a generic term in the 
Scoreflex world, subdivised in `ChallengeConfiguration`, `ChallengeRequest`,
`ChallengeTurn` and `ChallengeInstance`. 
The object mainly manipulated by Javascript games is the `ChallengeInstance`.
When the word "challenge" is used, it often refer to a challenge instance.

A `ChallengeInstance` object is particularly useful for:
- Submitting a player's turn (a score, a move ... depending on your gameplay)
- Get details on the challenge (who are the participants, the previous turns ...)
- Display the challenge current and final state (who won the challenge?)

### Getting a ChallengeInstance object ###

The main way to get a `ChallengeInstance` is to listen for 
`ScoreflexChallengeEvent`. Such an event is fired when the current player
press "Play challenge" in a Scoreflex challenge web view.  

````javascript
var scoreflexEventHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === "challenge") {
    var challengeInstance = detail.challenge;
  }
};
window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);
````

If you don't use the Scoreflex web view, you can still get a `ChallengeInstance`
object manually (The SDK may assist you in this task soon).

````javascript
var scoreflex = Scoreflex(/* ... */);

var getFirstInstance = function(Obj) {
  // traverse all instances and find the first one
  var type, configId, instances, i;
  for (type in data) {
    for (configId in data[type]) {
      instances = data[type][configId];
      if (instances.length > 0) {
        return scoreflex.Challenges.get(instances[0].id, configId);
      }
    }
  }
  return null;
};

var onGetAllInstances = function() {
  var data = this.reponseJSON;
  var challengeInstance = getFirstInstance(data);
  if (challengeInstance) {
    // now use the challengeInstance
  }
}

// Request all challenge instances of the current player
scoreflex.RestClient.get(
  "/challenges/instances",
  {types:["yourTurn"]},
  {onload:onGetAllInstances}
);
````

### Working with a ChallengeInstance object ###

The `ChallengeInstance` object provides methods to get details about the challenge, 
such as the players and the played turns. Methods to update the challenge by
sending a new turn for the player are also available.

Read the tutoral on handlers for more details on handlers.

````javascript
/* Submit a turn */

// -- get the current player's id
var currentPlayerId = scoreflex.Players.getCurrent().getId();

// -- prepare the turn's body
var body = {};
// Set the turn score for this player
body.score = 800;
// Indicate the player ended the challenge (and cannot send new turn)
body.instance = {participants: {}};
body.instance.participants[currentPlayerId] = {status: "FINISHED"};

// -- submit the turn
challengeInstance.submitTurn(
  body,
  {},
  {onload: function() { ... }}
);
````

````javascript
/* Submit a score only */
var score = 800;
challengeInstance.submitTurnScore(
  score,
  {},
  {onload: function() { ... }}
);
````

````javascript
/* Display the challenge current state in web view */
challengeInstance.showDetails();
````