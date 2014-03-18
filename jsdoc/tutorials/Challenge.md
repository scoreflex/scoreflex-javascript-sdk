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
`ScoreflexChallengeEvent`, `ScoreflexChallengeNewEvent` or
`ScoreflexChallengeUpdateEvent`. The first event is fired when the current player
press "Play challenge" in a Scoreflex challenge web view. The other two are
fired when watching for challenge events (see the Events tutorial).

````javascript
var scoreflexEventHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === "challenge" || name === "challengeNew" || name === "challengeUpdate") {
    var challengeInstance = detail.challenge;
  }
};
window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);
````

If you don't use the Scoreflex web view, you can still get a `ChallengeInstance`
object manually.

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
scoreflex.Challenges.getInstances({types: ["yourTurn"]}, {onload:onGetAllInstances});
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

### Watching for ChallengeInstance updates ###

A `ChallengeInstance` is often modified during is lifespan, and
you may be interested to display updates to your players as soon as possible.

When having a reference on a `ChallengeInstance` object, you can register it
to be watched for udpates. Each time a modification is detected a
`ScoreflexChallengeUpdateEvent` event is fired.

For now, the watch method uses a pull model which causes many requests to be
sent and may be changed in the future. Watch methods take a last parameter
`interval` to specify the pull frequency. You should adjust it according to
your needs.

````javascript
/* The challengInstance to watch */
var challenge = scoreflex.Challenges.get(instanceId, configId);

/* Register for watching */
scoreflex.Challenges.watchUpdates(challenge, 20*1000);

/* Handler to catch updates events (can be defined in the generic ScoreflexEvent handler) */
var challengeEventsHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === "challengeUpdate") {
    var challenge = detail.challenge;
    alert("The challenge "+challenge.instanceId+" has been updated!");
  }
};
window.addEventListener("ScoreflexEvent", challengeEventsHandler, false);
````

Note the actions of the current player may also update the `ChallengeInstance`
and trigger a `ScoreflexChallengeUpdateEvent` as a Result.

When you do not need to watch for updates anymore, just call
````javascript
scoreflex.Challenges.unwatchUpdates(challengeInstance);
````
or to stop watching all registered challenges
````javascript
scoreflex.Challenges.unwatchAllUpdates();
````

### Watching for new available challenges ###

Additionally to the previous watch feature, you can watch for new challenges
available to the player, either new invitations sent to him or a turn he can play.

These events can be registered only if your application is running.
On the contrary, on mobile platforms, the push notification feature offers
a more complete way of handling these events at any time.

````javascript
/* Register for watching */
scoreflex.Challenges.watchAllNew(); // see documentation for available parameters

/* Handler to catch events (can be defined in the generic ScoreflexEvent handler) */
var challengeEventsHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === "challengeNew") {
    var challenge = detail.challenge;
    var info = challenge.getLocalDetails() || {};
    // incite the player to engage in new challenge
    if (info.status === "running") {
      alert("It's your turn to play the challenge!");
    }
    else {
      alert("You've been invited to a challenge. Reply now!")
    }
  }
};
window.addEventListener("ScoreflexEvent", challengeEventsHandler, false);
````

You can stop watching for `ScoreflexChallengeNewEvent` by calling
````javascript
scoreflex.Challenges.unwatchAllNew();
````