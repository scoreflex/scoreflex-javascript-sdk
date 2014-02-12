### Concept ###

As soon as a leaderboard is configured into your Scoreflex account, using 
leaderboards becomes possible. In the Scoreflex Javascript SDK, Leaderboard 
objects are useful to manipulate scores in your game. In particular:
- Submit a score.
- Display a full leaderboard.
- Display a small rankbox for your player only.

### Getting a Leaderboard object ###

You work with a Leaderboard object by directly instanciating it. Example:

````javascript
var scoreflex = new Scoreflex(/* ... */);
var leaderboardId = "myLeaderboardName";
var leaderboard = scoreflex.Leaderboards.get(leaderboardId);
````

The `ScoreflexPlayEvent` also provides a Leaderboard object as a parameter.

````javascript
var scoreflexEventHandler = function(event) {
  var detail = event.detail || {};
  var name = detail.name;
  if (name === "play") {
    var leaderboard = detail.leaderboard;
  }
};
window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);
````

### Working with a Leaderboard object ###

The Leaderboard object provides several methods to display the leaderboard
web view or send a score.
Consult the Scoreflex [leaderboard documentation](http://developer.scoreflex.com/docs/guide/leaderboards/concepts)
for more details on leaderboard usage and the [API reference](http://developer.scoreflex.com/docs/reference/api/v1#ScoresService)
for more details on request parameters.

Read the tutoral on handlers for more details on handlers.

````javascript
// Send a score
var score = 800;
var parameters = {
  meta:"just a test", // facultative
  timeSpent:"1"       // facultative
};
var handlers = {
  onload:function() {console.log("score sent");}
};
leaderboard.submitScore(score, parameters, handlers);
````

````javascript
// Send a score and display the rank of the player in a small web view
leaderboard.submitScoreAndShowRankbox(score, parameters);
````

````javascript
// Display an overview of the leaderboards (friends, world and local)
leaderboard.showOverview();

// Display the full leaderboard. Parameters default to the default configuration
// but you can override them
var parameters = {
  collapsingMode: "latest"
};
leaderboard.showLeaderboard(parameters);
````