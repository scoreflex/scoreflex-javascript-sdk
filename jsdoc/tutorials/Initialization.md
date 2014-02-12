### Import the SDK and dependancies ###

CryptoJS librairies are useful to compute the Scoreflex signature for HTTP POST
requests.

Json2 file provides JSON `parse` and `stringify` functions for browser not
supporting them. You don't need to include this librairy if your game intend
to be played in recent browsers already having this support. 

Scripts to include:
- libs/CryptoJS/rollups/hmac-sha1.js
- libs/CryptoJS/components/enc-base64-min.js
- libs/Json/json2.js
- scoreflex.js

Import the webclient style if you intend to use Scoreflex web views in your game.

- style/styles.css

Start using the Scoreflex JavaScript SDK. Your clientId and clientSecret are
indicated on the game page of your Scoreflex developer account.

````javascript
var useSandbox = true;
var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
````

### Tips ###

#### Use a private scope ####

It is advised to instanciate the Scoreflex SDK in a non-global scope to avoid
anyone to access the API without your consent (ie, cheat).

```javascript
/* -- public scope -- */
var myGame = (function() {
  /* -- inner private scope using a closure -- */
  
  var useSandbox = true;
  var ScoreflexSDK = Scoreflex(/*clientId*/, /*clientSecret*/, useSandbox);
})();
```

#### Hide your credentials ####

Your clientId and clientSecret should not be in plain sight. You may want to
encode or encrypt them to keep them a secret.