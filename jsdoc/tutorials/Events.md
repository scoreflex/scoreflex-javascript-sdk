### Introduction ###

The scoreflex SDK fires 1 **ScoreflexEvent** event which has several subtypes.
- **ScoreflexSessionEvent** is fired for each SDK initialization events.
Listen for this event to check that SDK initialization has no issue.
- **ScoreflexPlayerEvent** is fired when the current Player is updated
(login or logout). Listen for this event if your game is tied to the currently
logged Player (for instance if you display the Player's name).
- **ScoreflexLeaderboardEvent** is fired when the "Play" button is pressed in the
Leaderboard page, meaning the current player wants to play the game associated
to this leaderboard. Yout don't have to listen for this event if your
leaderboard configurations disabled the "play" button.
- **ScoreflexChallengeEvent** is fired when the current player runs a challenge.
You have to listen for this event when using Scoreflex challenges.
- **ScoreflexChallengeNewEvent** is fired when the player may take action on
a challengeInstance (reply to invitation or play a turn).
You can to listen for this event when using Scoreflex challenges to incite the
player to take action.
- **ScoreflexChallengeUpdateEvent** is fired when a watched challengeInstance
has been updated (someone played, a condition timed out ...).
You can to listen for this event when using Scoreflex challenges to detect a
specific challenge's state changed.

### Usage and Examples ###

#### Listen for Scoreflex events ####

    var scoreflexEventHandler = function(event) {};
    window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);

#### Handle the Scoreflex events ####

    var scoreflexEventHandler = function(event) {
      var detail = event.detail || {};
      var name = detail.name;
      switch (name) {
        // -- ScoreflexSessionEvent --
        case "session":
          var state = detail.state;
          console.log("Session state is now: "
            + (state === Scoreflex.SessionState.SESSION_INIT_INPROGRESS
              ? 'IN PROGRESS'
              : (Scoreflex.SessionState.SESSION_INIT_SUCCESS
                ? 'DONE'
                : 'FAILED')
              )
          );
          break;

        // -- ScoreflexPlayerEvent --
        case "player":
          console.log("New Player just initialized.", detail.player);
          break;

        // -- ScoreflexLeaderboardEvent --
        case "play":
          var leaderboard = detail.leaderboard;
          // load the level associated to the leaderboard
          /* loadLevel(leaderboard); */
          break;

        // -- ScoreflexChallengeEvent --
        case "challenge":
          var challenge = detail.challenge;
          // load the level associated to the challenge
          /* loadChallenge(challenge); */
          break;

        // -- ScoreflexChallengeNewEvent --
        case "challengeNew":
          var challenge = detail.challenge;
          var info = challenge.getLocalDetails() || {};
          // incite the player to engage in new challenge
          if (info.status === "running") {
            alert("It's your turn to play the challenge!");
          }
          else {
            alert("You've been invited to a challenge. Reply now!")
          }
          break;

        // -- ScoreflexChallengeUpdateEvent --
        case "challengeUpdate":
          var challenge = detail.challenge;
          // display the challenge new state
          /* updateChallenge(challenge); */
          break;
      }
