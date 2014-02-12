### Introduction ###

The scoreflex SDK fires 1 **ScoreflexEvent** event which has 4 subtypes.
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

### Usage and Examples ###

#### Listen for Scoreflex events ####

    var scoreflexEventHandler = function(event) {};
    window.addEventListener("ScoreflexEvent", scoreflexEventHandler, false);

#### Handle the 4 Scoreflex events ####

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
      }
