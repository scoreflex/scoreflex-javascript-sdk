scoreflex-javascript-sdk
========================

Getting Started
---------------

1. Create a Scoreflex developer account at [https://developer.scoreflex.com/account/login](https://developer.scoreflex.com/account/login). Don’t forget to validate your account if you signed up via an email and password pair before continuing.
2. Download the last JavaScript SDK release on GitHub at https://github.com/scoreflex/scoreflex-javascript-sdk/releases
3. Import the SDK and the webclient style if you intend to use it in your JavaScript game.

    ```html
    <script type="text/javascript" src="scoreflex.js"></script>
    <link href="style/styles.css" type="text/css" rel="stylesheet">
    ```

4. Start using the Scoreflex JavaScript SDK. Your clientId and clientSecret are indicated on the game page of your Scoreflex developer account.

    ```javascript
    var useSandbox = true;
    var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
    ```

Developer's Guide
-----------------

### Cross-Origin Resource Sharing (CORS) ###

In order to contact the Scoreflex backend, the JavaScript Scoreflex SDK makes use of the Cross-Origin Resource Sharing specification from the W3C enabling browsers to reach external domains with AJAX requests. Consequently, only browsers compatible with CORS can safely request the Scoreflex backend ( [http://caniuse.com/#search=cors](http://caniuse.com/#search=cors) ).

### Scoping the SDK ###

It is advised to instanciate the Scoreflex SDK in a non-public scope to avoid easy access to the API by your players (which facilitate cheating).

```javascript
/* -- public scope -- */
var myGame = (function() {
  /* -- inner private scope with closure-- */
  
  var useSandbox = true;
  var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
})();
```

### Players, Leaderboards and Challenges objects ###

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

### Custom Requests ###
The JavaScript Scoreflex SDK also provides methods to send custom REST requests to the Scoreflex backend. For instance you can create new challenge instances for your players without using the Scoreflex web interfaces, get JSON data from the Scoreflex backend, or display a Scoreflex web interface not aliased by the SDK.

```javascript
/* Create a new challenge for a player (with random opponent) */
ScoreflexSDK.RestClient.post("/challenges/requests", {configId:"myChallengeConfigId"});

/* Display web interface listing your games on Scoreflex  */
var myDeveloperId = "xxxyyyzzz";
var path = "/web/developers/"+myDeveloperId+"/games";
ScoreflexSDK.WebClient.show(path);
```

SDK documentation
-----------------
The SDK documentation in a JSDoc format is available in the gh-pages branch and is served at: http://scoreflex.github.io/scoreflex-javascript-sdk/.

API Reference
-------------
All references to the Scoreflex API are available on the Scoreflex documentations pages: [http://developer.scoreflex.com/docs/reference/api/v1](http://developer.scoreflex.com/docs/reference/api/v1).
