/*
* Licensed to Scoreflex (www.scoreflex.com) under one
* or more contributor license agreements. See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership. Scoreflex licenses this
* file to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License. You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

/*
 * To regenerate the documentation:
 * jsdoc -d=jsdoc/ scoreflexSDK.js
 */

/*
 * Broswer requirements / module dependancies
 * - browser support for JSON API (or json2.js at http://www.JSON.org/json2.js)
 * - browser support for localStorage API
 * - browser support for XMLHttpRequest2 (support for CORS requests)
 * - browser support for classList API
 */

/**
 * Construct a ScoreflexSDK instance.
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {boolean} useSandbox
 * @return {object} Scoreflex SDK
 *
 * @module {Scoreflex} Scoreflex
 * @public
 **/
var Scoreflex = function(clientId, clientSecret, useSandbox) {
"use strict";

  var SFX = {};

  /**
   * Helper methods. Private to Scoreflex namespace.
   * @private
   * @namespace Scoreflex.Helper
   * @memberof module:Scoreflex
   */
  SFX.Helper = {
    /**
     * Test an element belongs to an Array.
     * @private
     * @param {mixed} el
     * @param {Array} arr
     * @return boolean
     */
    inArray: function(el, arr) {
      for (var i=0; i<arr.length; i++) {
        if (arr[i] === el) return true;
      }
      return false;
    },

    /**
     * Encode url parts.
     * @private
     * @param {string} str
     * @return {string} encoded string
     */
    rawurlencode: function(str) {
      // From: http://phpjs.org/functions
      // +   original by: Brett Zamir (http://brett-zamir.me)
      // +      input by: travc
      // +      input by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
      // +      input by: Michael Grier
      // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
      // +      input by: Ratheous
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // +   bugfixed by: Joris
      // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
      // %          note 1: This reflects PHP 5.3/6.0+ behavior
      // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
      // %        note 2: pages served as UTF-8
      // *     example 1: rawurlencode('Kevin van Zonneveld!');
      // *     returns 1: 'Kevin%20van%20Zonneveld%21'
      // *     example 2: rawurlencode('http://kevin.vanzonneveld.net/');
      // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
      // *     example 3: rawurlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
      // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
      str = (str + '').toString();

      // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
      // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
      return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
      replace(/\)/g, '%29').replace(/\*/g, '%2A');
    },

    /**
     * Generate an universal unique identifier.
     * @private
     * @return {string} uuid
     */
    getUUID: function() {
      // generates an unique id
      // inspired by
      // https://github.com/broofa/node-uuid/blob/master/uuid.js (MIT license)
      // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript

      // generate some random numbers
      var nums = new Array(31);

      if (window.crypto && crypto.getRandomValues) {
        // WHATWG crypto-based RNG - http://wiki.whatwg.org/wiki/Crypto
        // Moderately fast, high quality
        var _rnds8 = new Uint8Array(31);
        crypto.getRandomValues(_rnds8);
        for (var i = 0; i < 31; i++) {
          nums[i] = _rnds8[i] & 0xf;
        }
      }
      else {
        // Math.random()-based (RNG)
        for (var i = 0, r; i < 31; i++) {
          nums[i] = Math.random()*16|0;
        };
      }

      var p = 0;
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = nums[p++], v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    },

    /**
     * Generate a deviceId from an uuid.
     * @private
     * @return {string} deviceId
     */
    getDeviceId: function() {
      var deviceId;
      var key = "deviceId";
      if (window.localStorage) deviceId = localStorage.getItem(key);
      if (!deviceId) {
        deviceId = this.getUUID() + '-' + (+new Date()).toString(16);
        if (window.localStorage) localStorage.setItem(key, deviceId);
      }
      return deviceId;
    },

    /**
     * Dispatch an event on an element.
     * @private
     * @param DOMElement element
     * @param {string} eventType
     * @param {object} data
     * @return boolean success
     */
    fireEvent: function(element, eventType, data) {
      var evt;
      if(document.createEventObject)
      {
        // dispatch for IE
        evt = document.createEventObject();
        evt.data = data;
        return element.fireEvent('on'+eventType,evt);
      }
      else
      {
        evt = new CustomEvent(eventType, {detail:data, bubbles:true, cancelable:true});
        return !element.dispatchEvent(evt);
      }
    }

  };

  /**
   * Scoreflex SDK Object.
   * @param {string} clientId
   * @param {string} clientSecret
   * @param {boolean} useSandbox
   *
   * @public
   * @namespace SDK
   * @memberof module:Scoreflex
   */
  SFX.SDK = (function(clientId, clientSecret, useSandbox) {
    var DEFAULT_LANGUAGE_CODE = "en";
    var VALID_LANGUAGE_CODES = ["af", "ar", "be",
      "bg", "bn", "ca", "cs", "da", "de", "el", "en", "en_GB", "en_US", "es",
      "es_ES", "es_MX", "et", "fa", "fi", "fr", "fr_FR", "fr_CA", "he", "hi",
      "hr", "hu", "id", "is", "it", "ja", "ko", "lt", "lv", "mk", "ms", "nb",
      "nl", "pa", "pl", "pt", "pt_PT", "pt_BR", "ro", "ru", "sk", "sl", "sq",
      "sr", "sv", "sw", "ta", "th", "tl", "tr", "uk", "vi", "zh", "zh_CN",
      "zh_TW", "zh_HK"];

    var _initialized = false;
    var _initState = Scoreflex.SessionState.INIT_UNSTARTED;

    var _context = {
      clientId:null,
      clientSecret:null,
      useSandbox:true
    };
    var _session = {
      accessToken:null,
      sid:null,
      playerId:null
    };
    var _exports = {};


    //-- Common
    /**
     * Namespace: Common
     * @private
     * @namespace Common
     * @memberof module:Scoreflex.SDK
     */
    var Common = (function() {
      /**
       * Get an XMLHttpRequest2 object supporting CORS.
       * @param {string} method
       * @param {string} url
       * @return {XMLHttpRequest}
       *
       * @private
       * @memberof module:Scoreflex.SDK.Common
       */
      var getXHR = function(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          // XHR for Chrome/Firefox/Opera/Safari.
          xhr.open(method, url, true);
        }
        else if (typeof XDomainRequest != "undefined") {
          // XDomainRequest for IE.
          xhr = new XDomainRequest();
          xhr.open(method, url);
        }
        else {
          // CORS not supported.
          xhr = null;
        }
        return xhr;
      };

      /**
       * Ajax call.
       * @param {string} method
       * @param {string} url
       * @param {object} params in query string
       * @param {mixed} body (not supported yet)
       * @param {object} headers
       * @param {module:Scoreflex.SDK.Handlers} handlers
       *
       * @private
       * @memberof module:Scoreflex.SDK.Common
       */
      var request = function(method, url, params, body, headers, handlers) {
        var xhr = getXHR(method, url);
        if (headers !== undefined) {
          for (var h in headers) {
            xhr.setRequestHeader(h, headers[h]);
          }
        }
        if (xhr) {
          if (handlers) {
            var h = ['onerror', 'ontimeout', 'onabort', 'onloadend'];
            for (var i=0; i<h.length; i++) {
              if (handlers[h[i]]) {
                xhr[h[i]] = handlers[h[i]];
              }
            }
          }
          xhr.onload = function() {
            if (handlers) {
              try {
                xhr.responseJSON = parseJSON(this.responseText);
              }
              catch(e){}
              var status = this.status;
              if (status == 200 && handlers.onload) {
                handlers.onload.apply(this, arguments);
              }
              else if (handlers.onerror) {
                handlers.onerror.apply(this, arguments);
              }
            }
          };
          if (method === 'POST') {
            xhr.send(params);
          }
          else {
            xhr.send();
          }
        }
      };

      /**
       * Sort list of objects.
       * @param {object} a
       * @param {object} b
       * @return {int}
       *
       * @private
       * @memberof module:Scoreflex.SDK.Common
       */
      var _sortParams = function(a, b) {
        if (a.k == b.k) {
          return a.v < b.v ? -1 : 1;
        }
        return a.k < b.k ? -1 : 1;
      };

      /**
       * Generate the signature for ajax call.
       * @param {string} method
       * @param {string} url
       * @param {object} params
       * @param {string} body
       * @return {string} signature
       *
       * @private
       * @memberof module:Scoreflex.SDK.Common
       */
      var getSignature = function(method, url, params, body) {
        if (body === undefined) body = '';
        if (params === undefined) params = [];
        var i;

        // parse url
        var link = document.createElement('a');
        link.href = url;
        var protocol = link.protocol.substr(0, link.protocol.length-1).toLowerCase();
        var host = link.hostname.toLowerCase();
        var path = link.pathname;
        var queryString = link.search;
        if (queryString.length > 0 && queryString[0] === '?') {
          queryString = queryString.substr(1);
        }
        // params from url (already encoded)
        var qsp = queryString.split('&');
        var eparams = [];
        var kv;
        for (i=0; i<qsp.length; i++) {
          if (qsp[i] !== '') {
            kv = qsp[i].split('=', 2);
            eparams.push({k:kv[0], v:kv[1]});
          }
        }

        var encode = SFX.Helper.rawurlencode;

        // additionnal params (to encode)
        for (var k in params) {
          eparams.push({k:encode(k), v:encode(params[k])});
        }
        // sort all params
        eparams.sort(_sortParams); // sort by keys
        // concatenate sorted params
        var cparams = [];
        for (i=0; i<eparams.length; i++) {
          cparams.push(eparams[i].k + '=' + eparams[i].v);
        }
        // final query string
        var qs = cparams.join('&');

        var string = method
                   + '&'
                   + encode(protocol + '://' + host + path)
                   + '&'
                   + encode(qs)
                   + '&'
                   + encode(body);

        var secret = getContext().clientSecret;
        var hash = CryptoJS.HmacSHA1(string, secret);
        var hashB64 = hash.toString(CryptoJS.enc.Base64);
        var sig = encode(hashB64);
        return 'Scoreflex sig="'+sig+'", meth="0"';
      };

      /**
       * Turn a JSON-string into a JavaScript object.
       * @param {string} text
       * @return {object}
       *
       * @private
       * @memberof module:Scoreflex.SDK.Common
       */
      var parseJSON = function(text) {
        try {
          var json = JSON.parse(text);
          return json;
        }
        catch(e) {}
        return null;
      };

      return {
        request:request,
        getSignature:getSignature
      };

    })();
    //-- Common end


    //-- Handlers
    /**
     * Scoreflex object to handle RestClient request responses
     * @callback module:Scoreflex.SDK.Handlers
     * @param {object} callbacks
     * Callback functions are called in the scope (this keyword) of the
     * XMLHttpRequest object when available or the window object otherwise.
     * <br />- onload (Function) called on request success
     * <br />- onerror (Function) called on request failure
     * <br />- ontimeout (Function)
     * <br />- onabort (Function)
     * <br />- onloadend (Function)
     * @see See also {@link http://www.w3.org/TR/XMLHttpRequest2/#events|XMLHttpRequest2}
     */
    //-- Handlers end


    //-- Events
    /**
     * ScoreflexEvent
     * @protected
     * @namespace Events
     * @memberof module:Scoreflex.SDK
     */
    var Events = {
      /**
       * @return {ScoreflexEvent}
       * @private
       */
      ScoreflexSessionEvent: function() {
        /**
         * ScoreflexEvent to indicate SDK initialization state.
         * @property {string} name "session"
         * @property {module:Scoreflex.SessionState} state The sesssion initialization state
         *
         * @event ScoreflexSessionEvent
         * @memberof module:Scoreflex.SDK.Events
         * @see {@link module:Scoreflex.SDK.getSessionState}
         */
        return {
          name: "session",
          state: getSessionState()
        };
      },

      /**
       * @return {ScoreflexEvent}
       * @private
       */
      ScoreflexPlayerEvent: function() {
        var s = getSession() || {};
        /**
         * ScoreflexEvent to indicate the current player has been set or reset.
         * @property {string} name "player"
         * @property {module:Scoreflex.SDK.Player} player The current player
         * @property {boolean} anonymous "true" if the player is anonymous, "false" otherwise.
         *
         * @event ScoreflexPlayerEvent
         * @memberof module:Scoreflex.SDK.Events
         * @see {@link module:Scoreflex.SDK.Players.getCurrent}
         */
        return {
          name: "player",
          player:new Player(s.me.id, s.me),
          anonymous:s.anonymous
        };
      },

      /**
       * @param {module:Scoreflex.SDK.Leaderboard} leaderboard - Leaderboard instance
       * @return {ScoreflexEvent}
       * @private
       */
      ScoreflexPlayEvent: function(leaderboard) {
        /**
         * ScoreflexEvent to indicate the player wants to play a leaderboard.
         * The game associated to the leaderboard should be started.
         * @property {string} name "play"
         * @property {module:Scoreflex.SDK.Leaderboard} leaderboard The Leaderboard object
         *
         * @event ScoreflexPlayEvent
         * @memberof module:Scoreflex.SDK.Events
         */
        return {
          name: "play",
          leaderboard: leaderboard
        };
      },

      /**
       * @param {module:Scoreflex.SDK.ChallengeInstance} challenge - ChallengeIntance instance
       * @return {ScoreflexEvent}
       * @private
       */
      ScoreflexChallengeEvent: function(challenge) {
        /**
         * ScoreflexEvent to indicate the player wants to play a challenge.
         * The game associated with the challenge should be started.
         * @property {string} name "challenge"
         * @property {module:Scoreflex.SDK.ChallengeInstance} challenge The Challenge object
         *
         * @event ScoreflexChallengeEvent
         * @memberof module:Scoreflex.SDK.Events
         */
        return {
          name: "challenge",
          challenge: challenge
        };
      },

      /**
       * Fire a ScoreflexEvent in the window object.
       * @param {object} eventData
       *
       * @private
       * @memberof module:Scoreflex.SDK.Events
       */
      fire: function(eventData) {
        SFX.Helper.fireEvent(window, 'ScoreflexEvent', eventData);
      }
    };
    //-- Events end


    //-- REST API
    /**
     * Namespace: RestClient
     * @protected
     * @namespace RestClient
     * @memberof module:Scoreflex.SDK
     */
    var RestClient = (function(exports) {
      /*
       * CONSTANTS
       */
      var API_VERSION = 'v1';
      var PRODUCTION_API_URL = 'https://api.scoreflex.com';
      var SANDBOX_API_URL = 'https://sandbox.api.scoreflex.com';

      /**
       * Get the url to reach REST API endpoint.
       * @param {string} path - API endpoint path
       * @return {string} url
       *
       * @private
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var getUrl = function(path) {
        return (getContext().useSandbox ? SANDBOX_API_URL : PRODUCTION_API_URL)
                + '/' + API_VERSION
                + path;
      };

      /**
       * Add parameters common to all REST API calls.
       * @param {object} params - key/value pair of query string parameters
       * @return {object} all params
       *
       * @private
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var addCommonParams = function(params) {
        if (params === undefined) params = {};
        var session = getSession() || {};
        var lang = session.lang || window.navigator.language;
        params.lang = SFX.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
        if (session.accessToken) {
          params.accessToken = session.accessToken;
        }
        return params;
      };


      /**
       * Turn a list of object parameters to a query string.
       * @param {object} params - key/value pair of query string parameters
       * @return {string} query string
       *
       * @private
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var paramsToQueryString = function(params) {
        var p = [];
        for (var k in params) {
          p.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
        }
        return p.join('&');
      };

      /**
       * Perform a GET request to Scoreflex REST API.
       * @param {string} path - API endpoint path
       * @param {object} params - key/value pair of query string parameters
       * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
       *
       * @public
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var get = function(path, params, handlers) {
        params = addCommonParams(params);
        var url = getUrl(path);
        var parameters = paramsToQueryString(params);
        if (parameters) {
          url = url + '?' + parameters;
        }
        var headers = {};
        var body = undefined;
        Common.request('GET', url, {}, body, headers,handlers);
      };

      /**
       * Perform a POST request to Scoreflex REST API.
       * @param {string} path - API endpoint path
       * @param {object} params - key/value pair of query string parameters
       * @param {mixed} body - (not implemented)
       * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
       *
       * @public
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var post = function(path, params, body, handlers) {
        params = addCommonParams(params);
        var url = getUrl(path);
        var parameters = paramsToQueryString(params);
        var headers = {
          "Content-type": "application/x-www-form-urlencoded",
          "X-Scoreflex-Authorization": Common.getSignature('POST', url, params, body)
        };
        Common.request('POST', url, parameters, body, headers, handlers);
      };

      /**
       * Clean up the RestClient object
       * @private
       * @memberof module:Scoreflex.SDK.RestClient
       */
      var destroy = function() {
        // nothing to clean up
      };

      exports.RestClient = {
        destroy:destroy
      };

      return{
        post:post,
        get:get
      };
    })(_exports);
    //-- REST API end


    //-- WEB API
    /**
     * Namespace: WebClient
     * @protected
     * @namespace WebClient
     * @memberof module:Scoreflex.SDK
     */
    var WebClient = (function(exports){

      /*
       * CONSTANTS
       */
      var API_VERSION = 'v1';
      var PRODUCTION_WEBAPI_URL = 'https://api.scoreflex.com';
      var SANDBOX_WEBAPI_URL = 'https://sandbox.api.scoreflex.com';

      /*
       * Variables
       */
      var iframes = {};
      var iframesW = {};
      var stackIds = [];

      /**
       * Catch WebClient event messages. Apply action or dispatch local event.
       * @param {object} params - parameters of the event sent
       * @param {string} iframeId - identifier of the WebClient iframe sending the event
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var handleCallback = function(params, iframeId) {
        var code = params.code;
        var data = params.data ? JSON.parse(decodeURIComponent(params.data)) : {};

        switch (code) {
          case '200000': // logout
            close(iframeId);
            setSession(null, true);
            fetchAnonymousAccessTokenIfNeeded();
            break;

          case '200001': // close webview
            close(iframeId);
            break;

          case '200002': // play leaderboard
            var leaderboardId = data.leaderboardId;
            Events.fire(Events.ScoreflexPlayEvent(Leaderboards.get(leaderboardId)));
            close(iframeId);
            break;

          case '200003': // need authentication
            close(iframeId);
            authorize();
            break;

          case '200004': // oauth authentication granted
            var oauthCode = data.code;
            var oauthState = data.state;
            close(iframeId);
            fetchAccessToken({code:oauthCode, state:oauthState});
            break;

          case '200005': // move to new url
            var url = data.url;
            var mode = data.mode; // full or panel
            close(iframeId);
            show(url, {}, {style:mode});
            break;

          case '200006': // authenticate with service
            var service = data.service;
            var nextUrl = data.nextUrl;
            // TODO
            close(iframeId);
            break;

          case '200007': // launch challenge
            var challengeInstanceId = data.challengeInstanceId;
            var challengeConfigId = data.challengeConfigId;
            close(iframeId);
            Events.fire(Events.ScoreflexChallengeEvent(Challenges.get(challengeInstanceId, challengeConfigId)));
            break;

          case '200008': // link with service
            // TODO
            close(iframeId);
            break;

          case '200009': // invite with service
            // TODO
            close(iframeId);
            break;

          case '200010': // share with service
            // TODO
            close(iframeId);
            break;
        }
      };

      /**
       * Apply a style to a WebClient iframe.
       * @param {DOMIframeElement} iframe
       * @param {object} opt
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var applyStyle = function(iframe, opt) {
        var styleName = "scoreflexWebClient_"+opt.style;
        if (styleName !== undefined) {
          var curStyleName = iframe.getAttribute('data-stylename');
          if (curStyleName !== styleName) {
            iframe.classList.remove(curStyleName);
            iframe.classList.add(styleName);
            iframe.setAttribute('data-stylename', styleName);
          }
        }
      };

      /**
       * Get a reference to a WebClient iframe.
       * @param {string} id - reference name of the iframe
       * @return {DOMIframeElement}
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var getIframe = function(id) {
        if (!iframes[id]) {
          var iframe = document.createElement('iframe');
          iframe.id = "scoreflexWebClient_"+id;
          iframes[id] = iframe;
          iframe.onload = function() {
            iframesW[id]= iframe.contentWindow;
          };
        }
        return iframes[id];
      };

      /**
       * Set an iframe as the last opened/used one.
       * @param {string} id
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var stackTop = function(id) {
        stackRemove(id);
        stackIds.push(id);
      };
      /**
       * Remove an iframe from the opened/used stack.
       * @param {string} id
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var stackRemove = function(id) {
        for (var i=0; i<stackIds.length; i++) {
          if (stackIds[i] === id) {
            stackIds.splice(i, 1);
            break;
          }
        }
      };
      /**
       * Get the last opened/used iframe id.
       * @return {string|null} iframe id
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var getStackTopId = function() {
        if (stackIds.length > 0) {
          return stackIds[stackIds.length-1];
        }
        return null;
      };

      var lastUrlHandled = null;
      /**
       * Internal callback for WebClient events.
       * @param {DOMMessageEvent} event
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var onUrlChange = function(event) {
        if (event.origin == PRODUCTION_WEBAPI_URL || event.origin == SANDBOX_WEBAPI_URL) {
          var url = event.data;
          if (url === lastUrlHandled) {
            // we avoid to handled twice the same url
            return;
          }
          lastUrlHandled = url;
          var link = document.createElement('a');
          link.href = url;
          if (link.pathname == '/v1/web/callback') {
            var qs = link.search;
            if (qs.length > 0 && qs[0] == '?') qs = qs.substr(1);
            var list = qs.split('&');
            var params = {};
            var kv, i, k;
            for (i=0; i<list.length; i++) {
              if (list[i]) {
                kv = list[i].split('=', 2);
                params[kv[0]] = kv[1];
              }
            }
            // find the right iframe
            var iframeId = null;
            for (k in iframesW) {
              if (event.source === iframesW[k]) {
                iframeId = k;
                break;
              }
            }
            handleCallback(params, iframeId);
          }
        }
      };

      window.addEventListener("message", onUrlChange, false);

      /**
       * Add parameters common to all WEB API calls.
       * @param {object} params
       * @param {object} options (.noSid)
       * @return {object} all params
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var addCommonParams = function(params, options) {
        if (params === undefined) params = {};
        if (options === undefined) options = {};
        var session = getSession() || {};
        var lang = session.lang || window.navigator.language;
        params.lang = SFX.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
        if (session.sid && !options.noSid) {
          params.sid = session.sid;
        }
        return params;
      };

      /**
       * Merge WebClient options.
       * @param {object} options
       * @param {object} defaultOptions
       * @return {object} merged options
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var mergeOptions = function(options, defaultOptions) {
        var opt = options || {};
        if (defaultOptions !== undefined) {
          for (var k in defaultOptions) {
            if (opt[k] === undefined) {
              opt[k] = defaultOptions[k];
            }
          }
        }
        return opt;
      };

      /**
       * Build the url for the WebClient.
       * @param {string} path
       * @param {object} params - query string parameters
       * @param {object} options - query string options (.noSid)
       * @return {string|null} url
       *
       * @private
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var getUrl = function(path, params, options) {
        if (path.indexOf('://') !== -1) {
          // we have an absolute url. No process required
          return path;
        }
        var useSandbox = getContext().useSandbox;
        var sid = getSession().sid;
        if (sid) {
          params = addCommonParams(params, options);
          var eparams = [];
          for (var k in params) {
            eparams.push(encodeURIComponent(k)+'='+encodeURIComponent(params[k]));
          }
          var qs = eparams.join('&');

          return (useSandbox ? SANDBOX_WEBAPI_URL : PRODUCTION_WEBAPI_URL)
                + '/' + API_VERSION + path
                + '?' + qs;
        }
        return null;
      };

      /**
       * Display a WebClient.
       * @param {string} path - API endpoint path
       * @param {object} params - key/value pair of query string parameters
       * @param {object} options - query string options and WebClient options
       * @param {object} defaultOptions - default WebClient style options
       *
       * @public
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var show = function(path, params, options, defautOptions) {
        var opt = mergeOptions(options, defautOptions);
        var url = getUrl(path, params, opt);
        if (url) {
          var id = opt.id || opt.style || 'full';
          var iframe = getIframe(id);
          iframe.src = url + '#start';
          applyStyle(iframe, opt);
          document.body.appendChild(iframe);
          stackTop(id);
        }
        else {
          close();
        }
      };

      /**
       * Close the WebClient iframe identified by iframeId, or the
       * last opened/used one.
       * @param {string} iframeId
       *
       * @public
       * @memberof module:Scoreflex.SDK.WebClient
       */
      var close = function(iframeId) {
        var iframe;
        if (!iframeId) {
          // if iframeId is not defined, find the stack-top id
          iframeId = getStackTopId();
        }
        if (iframeId) {
          iframe = getIframe(iframeId);
          if (iframe && iframe.parentNode) {
            iframe.parentNode.removeChild(iframe);
            stackRemove(iframeId);
          }
        }
      };

      /**
       * Clean up the WebClient object
       * @private
       * @memberof module:Scorelfex.SDK.WebClient
       */
      var destroy = function() {
        // stop listening for events
        window.removeEventListener("message", onUrlChange, false);
        // close all the opened iframes
        var iframeId;
        while (iframeId = getStackTopId()) {
          close(iframeId);
        }
      };

      exports.WebClient = {
        destroy:destroy
      };

      return {
        show:show,
        close:close
      };
    })(_exports);
    //-- WEB API end


    //-- STORAGE
    /**
     * Storage using localStorage.
     * @private
     * @namespace Storage
     * @memberof module:Scoreflex.SDK
     */
    var Storage = (function(exports){
      var _ns = 'SFX_' + clientId + '_' + (useSandbox ? '1' : '0');
      /**
       * Get an object by key.
       * @param {string} key
       * @return {object}
       *
       * @private
       * @memberof module:Scoreflex.SDK.Storage
       */
      var get = function(key) {
        var s = localStorage.getItem(_ns + key);
        if (s) {
          return JSON.parse(s);
        }
        return null;
      };
      /**
       * Associate an object to a key.
       * @param {string} key
       * @param {object} data
       *
       * @private
       * @memberof module:Scoreflex.SDK.Storage
       */
      var set = function(key, data) {
        var s = JSON.stringify(data);
        return localStorage.setItem(_ns + key, s);
      };
      /**
       * Remove object associated with a key.
       * @param {string} key
       *
       * @private
       * @memberof module:Scoreflex.SDK.Storage
       */
      var rm = function(key) {
        return localStorage.removeItem(_ns + key);
      };

      exports.Storage = {};

      return {
        get:get,
        set:set,
        rm:rm
      };
    })(_exports);
    //-- STORAGE end


    //-- Player object
    /**
     * Player instance object.
     * @param {string} playerId - player ID
     * @param {object} data - player raw data
     *
     * @public
     * @class Player
     * @memberof module:Scoreflex.SDK
     */
    function Player(playerId, data) {

      /**
       * Return the player's identifier (playerId).
       * @return {string} Player ID
       *
       * @public
       * @function module:Scoreflex.SDK.Player#getId
       */
      this.getId = function() {
        return playerId;
      };

      /**
       * Return the player raw data.
       * @return {object}
       *
       * @public
       * @function module:Scoreflex.SDK.Player#getData
       */
      this.getData = function() {
        return data;
      };

      /**
       * Set the player raw data.
       *
       * @public
       * @function module:Scoreflex.SDK.Player#setData
       */
      this.setData = function(newData) {
        data = newData;
      };
    };

    /**
     * Get a player's data key
     * @return {mixed}
     *
     * @public
     * @function module:Scoreflex.SDK.Player#getValue
     */
    Player.prototype.getValue = function(key) {
      var d = this.getData();
      return d[key];
    };

    /**
     * Return the player's nickname.
     * @return {string} nickname
     *
     * @public
     * @function module:Scoreflex.SDK.Player#getNickname
     */
    Player.prototype.getNickname = function() {
      return this.getValue("nickName") || '';
    };

    /**
     * Return the avatar url of the player
     * @return {string} url
     *
     * @public
     * @function module:Scoreflex.SDK.Player#getAvatarUrl
     */
    Player.prototype.getAvatarUrl = function() {
      var url = this.getValue("avatarUrl");
      if (url) {
        return url;
      }
      return "https://www.scoreflex.com/"
              + (getContext().useSandbox ? 'sandbox/' : '')
              + "avatars/players/"+ this.getId() +"/";
    };

    /**
     * Return the location Object for the player, or a field value
     * @param {string} [key] - facultative field key (id, adminLevel, countryCode, formatted or title)
     * @return {Object|string}
     *
     * @public
     * @function module:Scoreflex.SDK.Player#getGeo
     */
    Player.prototype.getGeo = function(key) {
      var geo = this.getValue("geo") || {};
      if (key !== undefined) {
        return geo[key] || "";
      }
      return geo;
    };

    /**
     * Display a web client with the profile of the player.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Player#showProfile
     */
    Player.prototype.showProfile = function(parameters, options) {
      Players.showProfile(this.getId(), parameters, options);
    };

    /**
     * Display a web client with the list of friends of the player.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Player#showFriends
     */
    Player.prototype.showFriends = function(parameters, options) {
      showPlayerFriends(this.getId(), parameters, options);
    };
    //-- Player object end


    //-- Players static
    /**
     * Object to get and manipulate players.
     * @public
     * @namespace Players
     * @memberof module:Scoreflex.SDK
     */
    var Players = (function(exports) {
      var cache = {};

      /**
       * Return the current player as a Player object.
       * @return {module:Scoreflex.SDK.Player} Player instance
       *
       * @public
       * @memberof module:Scoreflex.SDK.Players
       */
      var getCurrent = function() {
        var data = (getSession() || {}).me || {};
        var playerId = data.id;
        return new Player(playerId, data);
      };

      /**
       * Request a player and call the onload handler with a {@link module:Scoreflex.SDK.Player}
       * instance.
       * @param {string} playerId - Player ID
       * @param {object} parameters - key/value pair of query string parameters
       * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
       * @param {boolean} noCache - if true, bypass the local cache
       *
       * @public
       * @memberof module:Scoreflex.SDK.Players
       */
      var get = function(playerId, parameters, handlers, noCache) {
        if (!isInitialized()) {
          throw new Scoreflex.InvalidStateException("SDK not initialized");
        }
        if (handlers === undefined) handlers = {};

        if (!noCache && cache[playerId]) {
          if (handlers.onload) {
            var p = new Player(playerId, cache[playerId]);
            setTimeout(function(){handlers.onload.call(null, p);}, 0);
          }
        }
        else {
          var i_onload = handlers.onload;
          handlers.onload = function() {
            var json = this.responseJSON || {};
            cache[playerId] = json;
            var p = new Player(playerId, json);
            if (i_onload) i_onload.call(this, p);
          };

          RestClient.get("/players/"+playerId, parameters, handlers);
        }
      };

      /**
       * Display a web client with the profile of a player (default, current player).
       * @param {string} playerId - default 'me'
       * @param {object} parameters - key/value pair of query string parameters
       * @param {object} options - key/value pair of WebClient options
       *
       * @public
       * @memberof module:Scoreflex.SDK.Players
       */
      var showProfile = function(playerId, parameters, options) {
        if (!isInitialized()) {
          throw new Scoreflex.InvalidStateException("SDK not initialized");
        }
        if (playerId === undefined) playerId = 'me';
        var params = pushParameters({}, parameters);
        var defaultOpt = {style:'full'};
        WebClient.show("/web/players/"+playerId, params, options, defaultOpt);
      };

      /**
       * Display a web client with the list of friends of a player (default, current player).
       * @param {string} playerId - default 'me'
       * @param {object} parameters - key/value pair of query string parameters
       * @param {object} options - key/value pair of WebClient options
       *
       * @public
       * @memberof module:Scoreflex.SDK.Players
       */
      var showFriends = function(playerId, parameters, options) {
        if (!isInitialized()) {
          throw new Scoreflex.InvalidStateException("SDK not initialized");
        }
        if (playerId === undefined) playerId = 'me';
        var params = pushParameters({}, parameters);
        var defaultOpt = {style:'full'};
        WebClient.show("/web/players/"+playerId+"/friends", params, options, defaultOpt);
      };

      /**
       * Clean up the Players object
       * @private
       * @memberof module:Scoreflex.SDK.Players
       */
      var destroy = function() {
        // clean up cache
        cache = {};
      };

      exports.Players = {
        destroy:destroy
      };

      return  {
        get:get,
        getCurrent:getCurrent,
        showProfile:showProfile,
        showFriends:showFriends
      };
    })(_exports);
    //-- Players static end


    //-- Leaderboard object
    /**
     * Leaderboard instance object.
     * @param {string} leaderboardId - Leaderboard ID
     *
     * @public
     * @class Leaderboard
     * @memberof module:Scoreflex.SDK
     */
    function Leaderboard(leaderboardId) {
      /**
       * Return the leaderboard identifier (leaderboardId).
       * @return {string} Leaderboard ID
       *
       * @public
       * @function module:Scoreflex.SDK.Leaderboard#getId
       */
      this.getId = function() {
        return leaderboardId;
      };
    }

    /**
     * Send a score to a leaderboard.
     * @param {int} score - raw score
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @function module:Scoreflex.SDK.Leaderboard#submitScore
     */
    Leaderboard.prototype.submitScore = function(score, parameters, handlers) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = {score:score};
      params = pushParameters(params, parameters);
      var body = undefined;
      RestClient.post("/scores/"+this.getId(), params, body, handlers);
    };

    /**
     * Display a web client for the requested leaderboard.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Leaderboard#show
     */
    Leaderboard.prototype.show = function(parameters, options) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/leaderboards/"+this.getId(), params, options, defaultOpt);
    };

    /**
     * Display a web client for the requested leaderboard overview.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Leaderboard#showOverview
     */
    Leaderboard.prototype.showOverview = function(parameters, options) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/leaderboards/"+this.getId()+"/overview", params, options, defaultOpt);
    };

    /**
     * Display a web client with the current player's score for the requested
     * leaderboard.
     * @param {object} parameters - (facultative, the last score of the player} 'score':{int}
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Leaderboard#showRankbox
     */
    Leaderboard.prototype.showRankbox = function(parameters, options) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'panel'};
      WebClient.show("/web/scores/"+this.getId()+"/ranks", params, options, defaultOpt);
    };

    /**
     * Put a score and show the rankbox. The rankbox takes into account
     * the score.
     * @param {int} score - raw score
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.Leaderboard#submitScoreAndShowRankbox
     */
    Leaderboard.prototype.submitScoreAndShowRankbox = function(score, parameters, options) {
      this.submitScore(score, parameters);
      var params = parameters || {};
      params.score = score;
      this.showRankbox(params, options);
    };
    //-- Leaderboard object end


    //-- Leaderboards static
    /**
     * Object to get and manipulate leaderboards.
     * @public
     * @namespace Leaderboards
     * @memberof module:Scoreflex.SDK
     */
    var Leaderboards = (function(exports) {
      /**
       * Get a Leaderboard instance
       * @return {module:Scoreflex.SDK.Leaderboard} Leaderboard instance
       *
       * @public
       * @memberof module:Scoreflex.SDK.Leaderboards
       */
      var get = function(leaderboardId) {
        return new Leaderboard(leaderboardId);
      };

      /**
       * Clean up the Leaderboards object
       * @private
       * @memberof module:Scoreflex.SDK.Leaderboards
       */
      var destroy = function() {
        // nothing to clean up
      };

      exports.Leaderboards = {
        destroy:destroy
      };

      return {
        get:get
      };
    })(_exports);
    //-- Leaderboards static end


    //-- ChallengeInstance object
    /**
     * ChallengeInstance object.
     * @param {string} instanceId - Challenge instance ID
     * @param {string} configId - Challenge configuration ID
     *
     * @public
     * @class ChallengeInstance
     * @memberof module:Scoreflex.SDK
     */
    function ChallengeInstance(instanceId, configId) {
      var cache_players = null;

      /**
       * Return the challenge instance identifier (challengeInstanceId).
       * @return {string} Challenge instance ID
       *
       * @public
       * @function module:Scoreflex.SDK.ChallengeInstance#getInstanceId
       */
      this.getInstanceId = function() {
        return instanceId;
      };

      /**
       * Return the challenge configuration identifier of the
       * instance (challengeConfigId).
       * @return {string} Challenge configuration ID
       *
       * @public
       * @function module:Scoreflex.SDK.ChallengeInstance#getConfigId
       */
      this.getConfigId = function() {
        return configId;
      };

      /**
       * Request challenge players and call the onload handler with a
       * list of {@link Player}.
       * @param {object} parameters - key/value pair of query string parameters
       * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
       * @param {boolean} noCache - if true, bypass the local cache
       *
       * @public
       * @function module:Scoreflex.SDK.ChallengeInstance#getPlayers
       */
      this.getPlayers = function(parameters, handlers, noCache) {
        if (handlers === undefined) handlers = {};
        if (!noCache && cache_players !== null) {
          if (handlers.onload) {
            setTimeout(function(){handlers.onload.call(null, cache_players);}, 0);
          }
        }
        else {
          var detailsHandlers = {
            onload: function() {
              var cjson = this.responseJSON || {};
              var participants = cjson.participants || {};
              var players = {};
              var count = 0;
              var received = 0;
              var id;
              // prebuild Player objects without data
              for (id in participants) {
                count++;
                players[id] = new Player(id, {});
              }
              var incrementalHandler = function(pjson) {
                received++;
                if (pjson.id) {
                  // update Player object with data
                  players[pjson.id] = new Player(pjson.id, pjson);
                }
                if (received >= count) {
                  cache_players = players;
                  setTimeout(function(){handlers.onload.call(null, players);}, 0);
                }
              };
              for (id in participants) {
                Players.get(id, {}, {
                  onload: function() {
                    var pjson = this.responseJSON || {};
                    incrementalHandler(pjson);
                  }
                });
              }
            },
            onerror: function() {
              if (handlers.onerror) handler.onerror.apply(this, arguments);
            }
          };
          this.getDetails(parameters, detailsHandlers);
        }
      };
    }

    /**
     * Get details of the challenge.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @function module:Scoreflex.SDK.ChallengeInstance#getDetails
     */
    ChallengeInstance.prototype.getDetails = function(parameters, handlers) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters(params, parameters);
      RestClient.get("/challenges/instances/"+this.getInstanceId(), params, handlers);
    };



    /**
     * Get turn details of a challenge instance.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @function module:Scoreflex.SDK.ChallengeInstance#getTurns
     */
    ChallengeInstance.prototype.getTurns = function(parameters, handlers) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters(params, parameters);
      RestClient.get("/challenges/instances/"+this.getInstanceId()+"/turns", params, handlers);
    };

    /**
     * Generic function to submit a challenge player's turn.
     * @param {object} turnBody - {@link http://developer.scoreflex.com/docs}
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @see {@link https://developer.scoreflex.com/docs/guide/challenges/reference#guide-challenges-reference-challengeturn}
     * @public
     * @function module:Scoreflex.SDK.ChallengeInstance#submitTurn
     */
    ChallengeInstance.prototype.submitTurn = function(turnBody, parameters, handlers) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      if (!turnBody || turnBody.turnSequence === undefined) {
        // request the turnSequence if we don't have it
        var me = this;
        this.getDetails({fields:"turn"}, {
          onload: function() {
            var json = this.responseJSON || {};
            var turnSequence = (json.turn || {}).sequence || 0;
            var newTurnBody = turnBody || {};
            newTurnBody.turnSequence = turnSequence;
            me.submitTurn(newTurnBody, parameters, handlers);
          },
          onerror: (handlers || {}).onerror
        });
      }
      else {
        // do the real turn post, with the turnSequence
        var params = {body:JSON.stringify(turnBody)};
        params = pushParameters(params, parameters);
        var body = undefined;
        RestClient.post("/challenges/instances/"+this.getInstanceId()+"/turns", params, body, handlers);
      }
    };

    /**
     * Specialized function to submit a challenge player's turn with score only.
     * @param {int} score - raw score
     * @param {object} parameters - (facultative, the score metadata) 'meta':{string}
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @function module:Scoreflex.SDK.ChallengeInstance#submitTurnScore
     */
    ChallengeInstance.prototype.submitTurnScore = function(score, parameters, handlers) {
      var turnBody = {score:score};
      this.submitTurn(turnBody, parameters, handlers);
    };

    /**
     * Display a web client with the details of a challenge instance.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @function module:Scoreflex.SDK.ChallengeInstance#showDetails
     */
    ChallengeInstance.prototype.showDetails = function(parameters, options) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/challenges/instances/"+this.getInstanceId(), params, options, defaultOpt);
    };
    //-- ChallengeInstance object end


    //-- Challenges static
    /**
     * Object to get and manipulate challenges.
     * @public
     * @namespace Challenges
     * @memberof module:Scoreflex.SDK
     */
    var Challenges = (function(exports) {
      /**
       * Display a web client with the list of challenges of the player.
       * @param {object} parameters - key/value pair of query string parameters
       * @param {object} options - key/value pair of WebClient options
       *
       * @public
       * @memberof module:Scoreflex.SDK.Challenges
       */
      var showChallenges = function(parameters, options) {
        if (!isInitialized()) {
          throw new Scoreflex.InvalidStateException("SDK not initialized");
        }
        var params = pushParameters({}, parameters);
        var defaultOpt = {style:'full'};
        WebClient.show("/web/challenges", params, options, defaultOpt);
      };

      /**
       * Request a challenge and call the onload handler with a
       * {@link module:Scoreflex.SDK.ChallengeInstance} object.
       * @param {string} challengeInstanceId - Challenge instance ID
       * @param {string} challengeConfigId - Challenge configuration ID
       * @return {module:Scoreflex.SDK.ChallengeInstance}
       *
       * @public
       * @memberof module:Scoreflex.SDK.Challenges
       */
      var get = function(challengeInstanceId, challengeConfigId) {
        return new ChallengeInstance(challengeInstanceId, challengeConfigId);
      };

      /**
       * Clean up the Challenges object
       * @private
       * @memberof module:Scoreflex.SDK.Challenges
       */
      var destroy = function() {
        // nothing to clean up
      };

      exports.Challenges = {
        destroy:destroy
      };

      return  {
        showChallenges:showChallenges,
        get:get
      };
    })(_exports);
    //-- Challenges static end


    //-- SDK continued
    /**
     * Get Game context.
     * @return {object}
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var getContext = function() {
      return _context;
    };

    /**
     * Get player session.
     * @return {object}
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var getSession = function() {
      var sessions = Storage.get('sessions');
      if (!sessions) sessions = {};
      if (sessions.player) {
        return sessions.player;
      }
      return sessions.anonymous;
    };

    /**
     * Set player session.
     * @param {object} session
     * @param {bool} logged
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var setSession = function(session, logged) {
      var sessions = Storage.get('sessions');
      if (!sessions) sessions = {};
      if (logged === true) {
        sessions.player = session;
      }
      else {
        sessions.anonymous = session;
      }
      Storage.set('sessions', sessions);
    };

    /**
     * Delete player session.
     *
     * @public
     * @memberof module:Scoreflex.SDK
     */
    var reset = function() {
      Storage.rm('sessions');
    };

    /**
     * Check the session is successfully initialized.
     * @return {bool}
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var isInitialized = function() {
      return _initialized;
    };

    /**
     * Get the session initialization state.
     * @return {module:Scoreflex.SessionState}
     *
     * @public
     * @memberof module:Scoreflex.SDK
     */
    var getSessionState = function() {
      return _initState;
    };

    /**
     * Set the session initialization state and send a Session event
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var setSessionState = function(state) {
      _initState = state;
      Events.fire(Events.ScoreflexSessionEvent());
    };


    var _oauthState = null;
    /**
     * Get or generate the oauth state parameter.
     * @param {bool} regen
     * @return {string}
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var getOauthState = function(regen) {
      if (regen === true || _oauthState === null) {
        _oauthState = 'S' + (+(new Date()));
      }
      return _oauthState;
    };

    /**
     * Merge two lists of parameters.
     * @param {object} params
     * @param {object} parameters
     * @return {object} merged list
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var pushParameters = function(params, parameters) {
      if (params === undefined) params = {};
      if (parameters !== undefined) {
        for (var k in parameters) {
          params[k] = parameters[k];
        }
      }
      return params;
    };

    /*++++++++++++++++++++++++
     + + + + API CALLS + + + +
     +++++++++++++++++++++++++*/

    /*
     * == REST API ==
     */

    /**
     * Request an anonymous access token for a guest.
     * @param {module:Scoreflex.SDK.Handlers} handlers
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var fetchAnonymousAccessToken = function(handlers) {
      var context = getContext();
      var params = {
        clientId: context.clientId,
        devicePlatform: 'Web',
        deviceModel: window.navigator.userAgent || 'browser',
        deviceId:SFX.Helper.getDeviceId()
      };
      var body = undefined;
      RestClient.post("/oauth/anonymousAccessToken", params, body, handlers);
    };

    /**
     * Request an anonymous access token for a guest if no local token exists.
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var fetchAnonymousAccessTokenIfNeeded = function(onload, onerror) {
      var session = getSession();

      var onLoad = function() {
        // we may not have a response in case the locally-stored session already existed
        var json = this.responseJSON || {};
        var accessToken = (json.accessToken || {}).token || null;
        var sid = json.sid || null;
        var me = json.me || {};
        var playerId = me.id || null;
        var lang = me.language || null;
        if (accessToken && sid && playerId) {
          setSession({
            anonymous:true,
            accessToken:accessToken,
            sid:sid,
            playerId:playerId,
            lang:lang,
            me:me
          }, false);
        }

        Events.fire(Events.ScoreflexPlayerEvent());

        if (onload) onload();
      };
      var onError = function() {
        if (onerror) onerror();
      };
      var handlers = {
        onload: onLoad,
        onerror: onError
      };

      if (session && session.accessToken && session.sid && session.playerId) {
        if (handlers.onload) {
          setTimeout(handlers.onload, 0);
        }
      }
      else {
        fetchAnonymousAccessToken(handlers);
      }
    };

    /**
     * Request an access token for a logged player.
     * @param {object} data with keys 'code' and 'state'
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var fetchAccessToken = function(data) {
      var state = data.state;
      if (state === getOauthState()) {
        var context = getContext();
        var params = {
          code: data.code,
          clientId: context.clientId
        };
        var body = undefined;

        var onLoad = function() {
          var json = this.responseJSON || {};
          var accessToken = (json.accessToken || {}).token || null;
          var sid = json.sid || null;
          var me = json.me || {};
          var playerId = me.id || null;
          var lang = me.language || null;
          if (accessToken && sid && playerId) {
            // save authenticated player in local session
            setSession({
              anonymous:false,
              accessToken:accessToken,
              sid:sid,
              playerId:playerId,
              lang:lang,
              me:me
            }, true);
            // remove ghost player from local session
            setSession(null, false);
          }
          Players.showProfile();
          Events.fire(Events.ScoreflexPlayerEvent());
        };
        var onError = function() {
          //console.log('error');
        };

        var handlers = {
          onload: onLoad,
          onerror: onError
        };

        RestClient.post("/oauth/accessToken", params, body, handlers);
      }
    };

    /**
     * Ping Scoreflex server.
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @memberof module:Scoreflex.SDK
     */
    var ping = function(handlers) {
      var params = {};
      RestClient.get("/network/ping", params, handlers);
    };

    /**
     * Set environment, ensure we have an accessToken.
     * @param {string} clientId
     * @param {string} clientSecret
     * @param {boolean} useSandbox
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var initialize = function(clientId, clientSecret, useSandbox) {
      if (!isInitialized()) {
        _context.clientId = clientId;
        _context.clientSecret = clientSecret;
        _context.useSandbox = useSandbox;

        setSessionState(Scoreflex.SessionState.INIT_INPROGRESS);
        var onload = function() {
          _initialized = true;
          setSessionState(Scoreflex.SessionState.INIT_SUCCESS);
        };
        var onerror = function() {
          setSessionState(Scoreflex.SessionState.INIT_FAILED);
        };
        fetchAnonymousAccessTokenIfNeeded(onload, onerror);
      }
    };

    /**
     * == WEB API ==
     */

    /**
     * Display web client to signin the current anonymous player.
     * @param {object} parameters
     * @param {object} options
     *
     * @private
     * @memberof module:Scoreflex.SDK
     */
    var authorize = function(parameters, options) {
      if (!isInitialized()) {
        throw new Scoreflex.InvalidStateException("SDK not initialized");
      }
      var session = getSession();
      if (session.anonymous === true) {
        var context = getContext();
        var params = {
          clientId: context.clientId,
          devicePlatform: 'Web',
          deviceModel: window.navigator.userAgent || 'browser',
          deviceId:SFX.Helper.getDeviceId(),
          state: getOauthState(true)
        };
        if (session.accessToken) {
          params.anonymousAccessToken = session.accessToken;
          params.forceMerge = 'true';
        }
        params = pushParameters(params, parameters);
        var defaultOpt = {style:'full', noSid:true};
        WebClient.show("/oauth/web/authorize", params, options, defaultOpt);
      }
    };

    /**
     * Check the type of an object.
     *
     * @param {object} obj
     * @param {string} type It should be "Player", "Leaderboard" or
     * "ChallengeInstance". For other values, the function returns false.
     *
     * @return <code>true</code> if the given object match the type,
     * <code>false</code> otherwise.
     *
     * @public
     * @memberof module:Scoreflex.SDK
     */
    var is = function(obj, type) {
      switch(type) {
        case "Player": return obj instanceof Player;
        case "Leaderboard": return obj instanceof Leaderboard;
        case "ChallengeInstance": return obj instanceof ChallengeInstance;
      };
      return false;
    };

    /**
     * Prepare the deletion of the SDK object.
     * Clean up object and reinit the SDK
     *
     * @public
     * @memberof module:Scoreflex.SDK
     */
    var destroy = function() {
      _exports.RestClient.destroy();
      _exports.WebClient.destroy();
      _exports.Players.destroy();
      _exports.Leaderboards.destroy();
      _exports.Challenges.destroy();

      _initialized = false;
      _initState = Scoreflex.SessionState.INIT_UNSTARTED;

      _context = {
        clientId:null,
        clientSecret:null,
        useSandbox:true
      };
      _session = {
        accessToken:null,
        sid:null,
        playerId:null
      };
    };

    initialize(clientId, clientSecret, useSandbox);

    return {
      // misc
      reset:reset, // delete localStorage session data
      is:is,
      destroy:destroy,
      getSessionState:getSessionState,
      // rest api
      RestClient: RestClient,
      ping:ping,
      // web api
      WebClient:WebClient,
      // objects
      Leaderboards: Leaderboards,
      Players: Players,
      Challenges: Challenges
    };

  })(clientId, clientSecret, useSandbox);

  return SFX.SDK;

};


/**
 * List of Session States
 * @readonly
 * @enum {integer}
 * @alias module:Scoreflex.SessionState
 * @memberof module:Scoreflex
 */
Scoreflex.SessionState = {
  /**
   * Session initialization failed
   */
  INIT_FAILED: -1,
  /**
   * Session initialization is not started
   */
  INIT_UNSTARTED: 0, // STOPPED
  /**
   * Session initialization is in progress
   */
  INIT_INPROGRESS: 1,
  /**
   * Session initilialization is successful
   */
  INIT_SUCCESS: 2 // STARTED
};

/**
 * Thrown to indicate that an operation as been attempted at an inappropriate
 * time.
 *
 * @class InvalidStateException
 * @param {string} message The Human-readable description of the error.
 * @memberof module:Scoreflex
 * @public
 */
Scoreflex.InvalidStateException = function InvalidStateException(message) {
    /**
     * The error name, here "InvalidStateException"
     *
     * @member {string} name
     * @memberof module:Scoreflex.InvalidStateException
     * @instance
     * @public
     */
    this.name = "InvalidStateException";

    /**
     * The Human-readable description of the error.
     *
     * @member {string} message
     * @memberof module:Scoreflex.InvalidStateException
     * @instance
     * @public
     */
    this.message = message;
};

/**
 * Thrown to indicate that a function has been passed an illegal or
 * inappropriate argument time.
 *
 * @class InvalidArgumentException
 * @param {string} message The Human-readable description of the error.
 * @memberof module:Scoreflex
 * @public
 */
Scoreflex.InvalidArgumentException = function InvalidArgumentException(message) {
    /**
     * The error name, here "InvalidArgumentException"
     *
     * @member {string} name
     * @memberof module:Scoreflex.InvalidArgumentException
     * @instance
     * @public
     */
    this.name = "InvalidArgumentException";

    /**
     * The Human-readable description of the error.
     *
     * @member {string} message
     * @memberof module:Scoreflex.InvalidArgumentException
     * @instance
     * @public
     */
    this.message = message;
};

/**
 * Thrown when an application attempts to use <code>null</code> or
 * <code>undefined</code> in a case where an object is required.
 *
 * @class NullReferenceException
 * @param {string} message The Human-readable description of the error.
 * @memberof module:Scoreflex
 * @public
 */
Scoreflex.NullReferenceException = function NullReferenceException(message) {
    /**
     * The error name, here "NullReferenceException"
     *
     * @member {string} name
     * @memberof module:Scoreflex.NullReferenceException
     * @instance
     * @public
     */
    this.name = "NullReferenceException";

    /**
     * The Human-readable description of the error.
     *
     * @member {string} message
     * @memberof module:Scoreflex.NullReferenceException
     * @instance
     * @public
     */
    this.message = message;
};

/**
 * Thrown to indicate that the requested operation is not supported.
 *
 * @class UnsupportedOperationException
 * @param {string} message The Human-readable description of the error.
 * @memberof module:Scoreflex
 * @public
 */
Scoreflex.UnsupportedOperationException = function UnsupportedOperationException(message) {
    /**
     * The error name, here "UnsupportedOperationException"
     *
     * @member {string} name
     * @memberof module:Scoreflex.UnsupportedOperationException
     * @instance
     * @public
     */
    this.name = "UnsupportedOperationException";

    /**
     * The Human-readable description of the error.
     *
     * @member {string} message
     * @memberof module:Scoreflex.UnsupportedOperationException
     * @instance
     * @public
     */
    this.message = message;
};
