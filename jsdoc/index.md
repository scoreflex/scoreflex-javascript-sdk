Getting Started
===============

Import the SDK

```html
<script type="text/javascript" src="scoreflex-full.js"></script>
```

Import the webclient style if you intend to use Scoreflex web views in your game.

```html
<link href="style/styles.css" type="text/css" rel="stylesheet">
```

Start using the Scoreflex JavaScript SDK. Your clientId and clientSecret are
indicated on the game page of your Scoreflex developer account.

```javascript
var useSandbox = true;
var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
```

Tips
====

It is advised to instanciate the Scoreflex SDK in a non-global scope to avoid
anyone to access the API without your consent.

```javascript
/* -- public scope -- */
var myGame = (function() {
  /* -- inner private scope using a closure -- */
  
  var useSandbox = true;
  var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
})();
```


Players, Leaderboards and Challenges objects
============================================

The `Players`, `Leaderboards` and `Challenges` objects are members of the ScoreflexSDK instance. They provide factory methods to get `Player`, `Leaderboard` and `ChallengeInstance` objects. They also provide generic methods to display some webviews.

* The `Player` object gives access to player's data and webviews.
* The `Leaderboard` object has methods to submit scores and display full and tiny leaderboards (rankbox) webviews. A Leaderboard reference is passed in the `leaderboard` parameter of a `ScoreflexPlayEvent` event.
* The `ChallengeInstance` object has methods to get a challenge instance's state, players, and turn information, as well as methods to send a new turn and display the detailed webview. A ChallengeInstance reference is passed in the `challenge` parameter of a `ScoreflexChallengeEvent` event.

```javascript
/* Get the current player’s nickname */
var player = ScoreflexSDK.Players.getCurrent();
var nickname = player.getNickname();

/* Submit a score to a leaderboard */
var leaderboard = ScoreflexSDK.Leaderboards.get("BestScores");
leaderboard.submitScore(547);

/* Display the challenges of the current player */
ScoreflexSDK.Challenges.showChallenges();
```
