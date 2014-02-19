(function () {
  // clientId / clientSecret
  var clientId = 'df0e25db7d75fc9f5f5206790532bf6de264f4ea';
  var clientSecret = '05085c2d11c93e1420b964d7955c661d2bec058288dd708f328a581ba4c7a84a';
  var useSandbox = true;
  var leaderboardId = 'BestScores';

  // -------------------- //
  // MOCK UPS
  // localStorage mock up

  var localStorage = {};
  localStorage.setItem = function (key, val) {
       this[key] = val + '';
  };
  localStorage.getItem = function (key) {
      return this[key];
  };
  Object.defineProperty(localStorage, 'length', {
      get: function () { return Object.keys(this).length - 2; }
  });

  //-------------------- //
  // TESTS HERE

  var initTests = function() {
    module("INITIALIZATION");
    test("Scoreflex session warm up", function() {
      expect(1);
      stop();
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'player') {
          ok(SDK.is(eventData.player, "Player"));
        }
        window.removeEventListener('ScoreflexEvent', handler, false);
        start();
      };
      window.addEventListener('ScoreflexEvent', handler, false);
    });

    test("Scoreflex session warmed up", function() {
      expect(1);
      stop();
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'player') {
          ok(SDK.is(eventData.player, "Player"));
        }
        window.removeEventListener('ScoreflexEvent', handler, false);
        start();
      };
      window.addEventListener('ScoreflexEvent', handler, false);
    });
  };

  var allTests = function() {
    module("DESTRUCTION");
    asyncTest("Destroy the SDK instance", function() {
      expect(3);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session' && eventData.state === Scoreflex.SessionState.INIT_SUCCESS) {
          window.removeEventListener('ScoreflexEvent', handler, false);

          ok(SDK.getSessionState() === Scoreflex.SessionState.INIT_SUCCESS);
          SDK.destroy();
          ok(SDK.getSessionState() === Scoreflex.SessionState.INIT_UNSTARTED);

          try {
            Players.get('1234567890abcdef', {}, {}, true);
            ok(false);
          }
          catch(e) {
            ok(true);
          }

          start();
        }
      };
      window.addEventListener('ScoreflexEvent', handler, false);
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);
    });

    module("PUBLIC API");
    test("Scoreflex public API", function() {
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);

      notStrictEqual(SDK, undefined, "SDK is defined");
      notStrictEqual(SDK, null, "SDK is not null");
      ok(SDK.RestClient != null,    "SDK has public API: RestClient");
      ok(SDK.WebClient != null,     "SDK has public API: WebClient");
      ok(SDK.Players != null,       "SDK has public API: Players");
      ok(SDK.Leaderboards != null,  "SDK has public API: Leaderboards");
      ok(SDK.Challenges != null,    "SDK has public API: Challenges");
    });

    module("EVENTS");
    asyncTest("Scoreflex event progress to success", function() {
      expect(2);
      var firstHandler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session') {
          window.removeEventListener('ScoreflexEvent', firstHandler, false);
          ok(eventData.state === Scoreflex.SessionState.INIT_INPROGRESS);
        }
      };
      window.addEventListener('ScoreflexEvent', firstHandler, false);

      var SDK = Scoreflex(clientId, clientSecret, useSandbox);

      var secondHandler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session') {
          window.removeEventListener('ScoreflexEvent', secondHandler, false);
          ok(eventData.state === Scoreflex.SessionState.INIT_SUCCESS);
          start();
        }
      };
      window.addEventListener('ScoreflexEvent', secondHandler, false);
    });

    module("REST CLIENT");
    asyncTest("ping/pong", function() {
      expect(1);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session' && eventData.state === Scoreflex.SessionState.INIT_SUCCESS) {
          window.removeEventListener('ScoreflexEvent', handler, false);

          SDK.RestClient.get("/network/ping", {}, {onload:function(){
            ok(this.responseJSON.pong);
            start();
          }});
        }
      };
      window.addEventListener('ScoreflexEvent', handler, false);
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);
    });

    module("PLAYERS");
    asyncTest("players: init, current & requested", function(){
      expect(8);

      var initPlayer;
      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'player') {
          initPlayer = eventData.player;
          return;
        }
        if (initPlayer && eventData.name === 'session' && eventData.state === Scoreflex.SessionState.INIT_SUCCESS) {
          window.removeEventListener('ScoreflexEvent', handler, false);

          var currentPlayer = SDK.Players.getCurrent();

          ok(initPlayer.getId() === currentPlayer.getId());
          ok(initPlayer.getNickname() === currentPlayer.getNickname());
          ok(initPlayer.getAvatarUrl() === currentPlayer.getAvatarUrl());
          deepEqual(initPlayer.getGeo(), currentPlayer.getGeo());

          SDK.Players.get(initPlayer.getId(), {}, {onload:function(requestedPlayer) {

            ok(requestedPlayer.getId() === currentPlayer.getId());
            ok(requestedPlayer.getNickname() === currentPlayer.getNickname());
            ok(requestedPlayer.getAvatarUrl() === currentPlayer.getAvatarUrl());
            deepEqual(requestedPlayer.getGeo(), currentPlayer.getGeo());

            start();
          }}, true);
        }
      };
      window.addEventListener('ScoreflexEvent', handler, false);
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);
    });

    module("LEADERBOARDS");
    asyncTest("Build leaderboard", function(){
      expect(1);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session' && eventData.state === Scoreflex.SessionState.INIT_SUCCESS) {
          window.removeEventListener('ScoreflexEvent', handler, false);

          var leaderboard = SDK.Leaderboards.get(leaderboardId);
          ok(leaderboard.getId() === leaderboardId);
          start();
        }
      };
      window.addEventListener('ScoreflexEvent', handler, false);
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);
    });

    asyncTest("Submit score on leaderboard", function(){
      expect(1);

      var handler = function(event) {
        var eventData = event.detail || {};
        if (eventData.name === 'session' && eventData.state === Scoreflex.SessionState.INIT_SUCCESS) {
          window.removeEventListener('ScoreflexEvent', handler, false);

          var leaderboard = SDK.Leaderboards.get(leaderboardId);
          leaderboard.submitScore(123, {}, {
            onload:function() {
              ok(this.responseJSON.success === true);
              start();
            },
            onerror: function() {
              ok(false);
              start();
            }
          });
        }
      };
      window.addEventListener('ScoreflexEvent', handler, false);
      var SDK = Scoreflex(clientId, clientSecret, useSandbox);
    });

  };

  initTests();
  setTimeout(allTests, 2000);

})();




