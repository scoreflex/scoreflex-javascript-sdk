### Concept ###

The Scoreflex SDK often requests the Scoreflex backend for data. To avoid 
blocking the interface and the game, requests are perform asynchronously.

The use of request handlers enable to get the response whenever the request 
is fulfilled, without bothering too much with network latency.

The requests handlers provided in the Scoreflex SDK are the same as those
provided by the XMLHttpRequest native object. In particular, you may be 
interested in the `onload` and `onerror` handlers.

### Usage ###

A handler is a callback function whose context is an XMLHttpRequest object. You
can pass a list of handlers to methods requiring them. We use the 
`Leaderboard.submitScore(score, parameters, handlers)` method as an example.

````javascript
var submitOk = function() {
  // The "this" keyword refer to the XMLHttpRequest object.
  // Scoreflex SDK provides the useful responseJSON property. 
  var json = this.responseJSON;
  console.log("Success with response ", json);
};
var submitError = function() {
  var code = this.status || '?';
  console.log("Error with code "+code);
};

var score = 800;
var parameters = {};
var handlers = {
  onload:submitOk,
  onerror:submitError
};
Leaderboard.submitScore(score, parameters, handlers)
````

The list of possible handlers is the same as those supported by the
[XMLHttpRequest2](http://www.w3.org/TR/XMLHttpRequest2/#events) object, modulo
their implementation in browsers. Below are the events documented by the W3C.
The handler name is just "on" followed by the event's 
name (example: "load" event => "onload" handler).

- loadstart
- progress
- abort
- error
- load
- timeout
- loadend