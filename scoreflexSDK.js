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

/**
 * Broswer requirements / module dependancies
 * - browser support for JSON API (or json2.js at http://www.JSON.org/json2.js)
 * - browser support for localStorage API
 * - browser support for XMLHttpRequest2 (support for CORS requests)
 * - browser support for classList API
 *
 **/
var Scoreflex = function() {

// create namespace
var Scoreflex = {};

// helper
Scoreflex.Helper = {
  /**
   * public
   */
  inArray: function(el, arr) {
    for (var i=0; i<arr.length; i++) {
      if (arr[i] === el) return true;
    }
    return false;
  },

  /**
   * public
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

  getBrowserID: function() {
    var browserFeatures = navigator.userAgent + navigator.platform + screen.width + 'x'+ screen.height;
    var len = navigator.mimeTypes.length;
    for (var i = 0; i < len; i++) {
      browserFeatures +=  navigator.mimeTypes[i].description +  navigator.mimeTypes[i].type;
    }
    if (typeof window.GearsFactory == 'function') {
      browserFeatures += "gears";

    }
    return CryptoJS.HmacSHA1(browserFeatures, 'scoreflex');
  },

  /**
   * public
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
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(eventType, true, true); // event type,bubbling,cancelable
      evt.data = data;
      return !element.dispatchEvent(evt);
    }
  }

};

// SDK
Scoreflex.SDK = (function() {
  var DEFAULT_LANGUAGE_CODE = "en";
  var VALID_LANGUAGE_CODES = ["af", "ar", "be",
    "bg", "bn", "ca", "cs", "da", "de", "el", "en", "en_GB", "en_US", "es",
    "es_ES", "es_MX", "et", "fa", "fi", "fr", "fr_FR", "fr_CA", "he", "hi",
    "hr", "hu", "id", "is", "it", "ja", "ko", "lt", "lv", "mk", "ms", "nb",
    "nl", "pa", "pl", "pt", "pt_PT", "pt_BR", "ro", "ru", "sk", "sl", "sq",
    "sr", "sv", "sw", "ta", "th", "tl", "tr", "uk", "vi", "zh", "zh_CN",
    "zh_TW", "zh_HK"];

  var _initialized = false;
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

  //-- Common
  var Common = (function() {
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
            if (handlers[h[i]]) xhr[h[i]] = handlers[h[i]];
          }
        }
        xhr.onload = function() {
          if (handlers && handlers.onload) {
            xhr.responseJSON = parseJSON(this.responseText);
            handlers.onload.apply(this, arguments);
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

    var _sortParams = function(a, b) {
      if (a.k == b.k) {
        return a.v < b.v ? -1 : 1;
      }
      return a.k < b.k ? -1 : 1;
    };

    var getSignature = function(method, url, params, body) {
      var secret = getContext().clientSecret;
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

      var encode = Scoreflex.Helper.rawurlencode;

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

      var hash = CryptoJS.HmacSHA1(string, secret);
      var hashB64 = hash.toString(CryptoJS.enc.Base64);
      var sig = encode(hashB64);
      return 'Scoreflex sig="'+sig+'", meth="0"';
    };

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

  //-- REST API
  var RestClient = (function() {
    /**
     * CONSTANTS
     */
    var API_VERSION = 'v1';
    var PRODUCTION_API_URL = 'https://api.scoreflex.com';
    var SANDBOX_API_URL = 'https://sandbox.api.scoreflex.com';

    var ERROR_INVALID_PARAMETER = 10001;
    var ERROR_MISSING_MANDATORY_PARAMETER = 10002;
    var ERROR_INVALID_ACCESS_TOKEN = 11003;
    var ERROR_SECURE_CONNECTION_REQUIRED = 10005;
    var ERROR_INVALID_PREV_NEXT_PARAMETER = 12011;
    var ERROR_INVALID_SID = 12017;
    var ERROR_SANDBOX_URL_REQUIRED = 12018;
    var ERROR_INACTIVE_GAME = 12019;
    var ERROR_MISSING_PERMISSIONS = 12020;
    var ERROR_PLAYER_DOES_NOT_EXIST = 12000;
    var ERROR_DEVELOPER_DOES_NOT_EXIST = 12001;
    var ERROR_GAME_DOES_NOT_EXIST = 12002;
    var ERROR_LEADERBOARD_CONFIG_DOES_NOT_EXIST = 12004;
    var ERROR_SERVICE_EXCEPTION = 12009;

    /**
     * private
     */
    var getUrl = function(path) {
      return (getContext().useSandbox ? SANDBOX_API_URL : PRODUCTION_API_URL)
              + '/' + API_VERSION
              + path;
    };

    /**
     * private
     */
    var addCommonParams = function(params) {
      if (params === undefined) params = {};
      var session = getSession() || {};
      var lang = session.lang || window.navigator.language;
      params.lang = Scoreflex.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
      if (session.accessToken) {
        params.accessToken = session.accessToken;
      }
      return params;
    };

    /**
     * private
     */
    var paramsToQueryString = function(params) {
      var p = [];
      for (var k in params) {
        p.push(encodeURIComponent(k) + '=' + encodeURIComponent(params[k]));
      }
      return p.join('&');
    };

    /**
     * public
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
     * public
     */
    var post = function(path, params, body, handlers) {
      params = addCommonParams(params);
      var url = getUrl(path);
      var parameters = paramsToQueryString(params);
      var headers = {
        "Content-type": "application/x-www-form-urlencoded",
        //"X-Scoreflex-Lenient": "yes"
        "X-Scoreflex-Authorization": Common.getSignature('POST', url, params, body)
      };
      Common.request('POST', url, parameters, body, headers, handlers);
    };

    return{
      post:post,
      get:get
    };
  })();
  //-- REST API end

  //-- WEB API
  WebClient = (function(){

    /**
     * CONSTANTS
     */
    var API_VERSION = 'v1';
    var PRODUCTION_WEBAPI_URL = 'https://api.scoreflex.com';
    var SANDBOX_WEBAPI_URL = 'https://sandbox.api.scoreflex.com';

    /**
     * Variables
     */
    var iframes = {};
    var iframesW = {};
    var stackIds = [];

    var handleCallback = function(params, iframeId) {
      var code = params.code;
      var data = params.data ? JSON.parse(decodeURIComponent(params.data)) : {};

      switch (code) {
        case '200000': // logout
          close(iframeId);
          setSession(null, true);
          fetchAnonymousAccessTokenIfNeeded();
          Scoreflex.Helper.fireEvent(window, 'ScoreflexEvent', {name:'session', logout:true});
          break;

        case '200001': // close
          close(iframeId);
          break;

        case '200002': // play leaderboard
          var leaderboardId = data.leaderboardId;
          Scoreflex.Helper.fireEvent(window, 'ScoreflexEvent', {name:'play', leaderboardId:leaderboardId});
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
          Scoreflex.Helper.fireEvent(window, 'ScoreflexEvent', {name:'challenge', challengeInstanceId:challengeInstanceId, challengeConfigId:challengeConfigId});
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

    var stackTop = function(id) {
      stackRemove(id);
      stackIds.push(id);
    };
    var stackRemove = function(id) {
      for (var i=0; i<stackIds.length; i++) {
        if (stackIds[i] === id) {
          stackIds.splice(i, 1);
          break;
        }
      }
    };
    var getStackTopId = function() {
      if (stackIds.length > 0) {
        return stackIds[stackIds.length-1];
      }
      return null;
    };

    var lastUrlHandled = null;
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

    var addCommonParams = function(params, options) {
      if (params === undefined) params = {};
      if (options === undefined) options = {};
      var session = getSession() || {};
      var lang = session.lang || window.navigator.language;
      params.lang = Scoreflex.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
      if (session.sid && !options.noSid) {
        params.sid = session.sid;
      }
      return params;
    };

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

    return {
      show:show,
      close:close
    };
  })();
  //-- WEB API end

  //-- STORAGE
  Storage = (function(){
    _ns = 'SFX_';
    get = function(key) {
      var s = localStorage.getItem(_ns + key);
      if (s) {
        return JSON.parse(s);
      }
      return null;
    };
    set = function(key, data) {
      var s = JSON.stringify(data);
      return localStorage.setItem(_ns + key, s);
    };
    rm = function(key) {
      return localStorage.removeItem(_ns + key);
    };
    return {
      get:get,
      set:set,
      rm:rm
    };
  })();
  //-- STORAGE end

  //-- SDK continued

  /**
   * private
   */
  var getContext = function() {
    return _context;
  };

  /**
   * private
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
   * private
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
   * public
   */
  var reset = function() {
    Storage.rm('sessions');
  };

  /**
   * private
   */
  var isInitialized = function() {
    return _initialized;
  };

  /**
   * private
   */
  var _oauthState = null;
  var getOauthState = function(regen) {
    if (regen === true || _oauthState === null) {
      _oauthState = 'S' + (+(new Date()));
    }
    return _oauthState;
  };

  /**
   * private
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

  /*************************
   * * * * API CALLS * * * *
   *************************/

  /**
   * == REST API ==
   */

  /**
   * private
   */
  var fetchAnonymousAccessToken = function(handlers) {
    var context = getContext();
    var params = {
      clientId: context.clientId,
      devicePlatform: 'Web',
      deviceModel: window.navigator.userAgent || 'browser'
    };
    var body = undefined;
    RestClient.post("/oauth/anonymousAccessToken", params, body, handlers);
  };

  /**
   * private
   */
  var fetchAnonymousAccessTokenIfNeeded = function() {
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
      _initialized = true;
    };
    var onError = function() {
      //console.log('error');
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
   * private
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
        showProfile();
        Scoreflex.Helper.fireEvent(window, 'ScoreflexEvent', {name:'session', login:true});
      };
      var onError = function() {
        //console.log('error');
      };

      handlers = {
        onload: onLoad,
        onerror: onError
      };

      RestClient.post("/oauth/accessToken", params, body, handlers);
    }
  };

  /**
   * @visibility public
   * @param Object handlers
   */
  var ping = function(handlers) {
    var params = {};
    RestClient.get("/network/ping", params, handlers);
  };

  /**
   * Set environment, ensure we have an accessToken
   * @visibility public
   * @param string clientId
   * @param stirng clientSecret
   * @param boolean useSandbox
   */
  var initialize = function(clientId, clientSecret, useSandbox) {
    if (!isInitialized()) {
      _context.clientId = clientId;
      _context.clientSecret = clientSecret;
      _context.useSandbox = useSandbox;

      fetchAnonymousAccessTokenIfNeeded();
    }
  };

  /**
   * @visibility public
   * @param string leaderboarId
   * @param int score
   * @param Object parameters
   * @param Object handlers
   */
  var submitScore = function(leaderboardId, score, parameters, handlers) {
    if (!isInitialized()) return;
    var params = {score:score};
    params = pushParameters(params, parameters);
    var body = undefined;
    RestClient.post("/scores/"+leaderboardId, params, body, handlers);
  };

  /**
   * @visibility public
   * @param string instanceId
   * @param Object parameters - fields (string): "core,config,turn,turnHistory,outcome"
   * @param Object handlers
   */
  var getChallengeInstance = function(instanceId, parameters, handlers) {
    if (!isInitialized()) return;
    var params = pushParameters(params, parameters);
    RestClient.get("/challenges/instances/"+instanceId, params, handlers);
  };

  /**
   * @visibility public
   * @param string instanceId
   * @param Object parameters
   * @param Object handlers
   */
  var getChallengeTurns = function(instanceId, parameters, handlers) {
    if (!isInitialized()) return;
    var params = pushParameters(params, parameters);
    RestClient.get("/challenges/instances/"+instanceId+"/turns", params, handlers);
  };

  /**
   * Generic function to submit a challenge player's turn
   * @visibilty public
   * @param string instanceId
   * @param Object turnBody
   * @param Object parameters
   * @params Object handlers
   */
  var submitChallengeTurn = function(instanceId, turnBody, parameters, handlers) {
    if (!isInitialized()) return;
    if (!turnBody || turnBody.turnSequence === undefined) {
      // request the turnSequence if we don't have it
      getChallengeInstance(instanceId, {fields:"turn"}, {
        onload: function() {
          var json = this.responseJSON || {};
          var turnSequence = (json.turn || {}).sequence || 0;
          var newTurnBody = turnBody || {};
          newTurnBody.turnSequence = turnSequence;
          submitChallengeTurn(instanceId, newTurnBody, parameters, handlers);
        },
        onerror: (handlers || {}).onerror
      });
    }
    else {
      // do the real turn post, with the turnSequence
      var params = {body:JSON.stringify(turnBody)};
      params = pushParameters(params, parameters);
      var body = undefined;
      RestClient.post("/challenges/instances/"+instanceId+"/turns", params, body, handlers);
    }
  };

  /**
   * Specialized function submit a challenge player's turn with a score only
   * @visibility public
   * @param string instanceId
   * @param int score
   * @param Object parameters
   * @param Object handlers
   */
  var submitChallengeTurnScore = function(instanceId, score, parameters, handlers) {
    var turnBody = {score:score};
    submitChallengeTurn(instanceId, turnBody, parameters, handlers);
  };

  /**
   * == WEB API ==
   */

  /**
   * Display web client to signin the current anonymous player
   * @visibility private
   * @param Object parameters
   * @param Object options
   */
  var authorize = function(parameters, options) {
    if (!isInitialized()) return;
    var session = getSession();
    if (session.anonymous === true) {
      var context = getContext();
      var params = {
        clientId: context.clientId,
        devicePlatform: 'Web',
        deviceModel: window.navigator.userAgent || 'browser',
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
   * Display a web client with the profile of a player (default, current player)
   * @visibility public
   * @param string playerId (default 'me')
   * @param Object parameters
   * @param Object options
   */
  var showProfile = function(playerId, parameters, options) {
    if (!isInitialized()) return;
    if (playerId === undefined) playerId = 'me';
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/players/"+playerId, params, options, defaultOpt);
  };

  /**
   * Display a web client with the list of friends of a player (default, current player)
   * @visibility public
   * @param string playerId (default 'me')
   * @param Object parameters
   * @param Object options
   */
  var showFriends = function(playerId) {
    if (!isInitialized()) return;
    if (playerId === undefined) playerId = 'me';
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/players/"+playerId+"/friends", params, options, defaultOpt);
  };

  /**
   * Display a web client for the requested leaderboard
   * @visibilty public
   * @param string leaderboardId
   * @param Object parameters
   * @param Object options
   */
  var showLeaderboard = function(leaderboardId, parameters, options) {
    if (!isInitialized() || !leaderboardId) return;
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/leaderboards/"+leaderboardId, params, options, defaultOpt);
  };

  /**
   * Display a web client for the requested leaderboard overview
   * @visibility public
   * @param string leaderboardId
   * @param Object parameters
   * @param Object options
   */
  var showLeaderboardOverview = function(leaderboardId, parameters, options) {
    if (!isInitialized() || !leaderboardId) return;
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/leaderboards/"+leaderboardId+"/overview", params, options, defaultOpt);
  };

  /**
   * Display a web client with the current player's score for the requested
   * leaderboard.
   * @visibility public
   * @param string leaderboardId
   * @param Object parameters - score: the last score of the player
   * @param Object options
   */
  var showRankbox = function(leaderboardId, parameters, options) {
    if (!isInitialized() || !leaderboardId) return;
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'panel'};
    WebClient.show("/web/scores/"+leaderboardId+"/ranks", params, options, defaultOpt);
  };

  /**
   * Put a score and show the rankbox. The rankbox takes into account the score.
   * @visibility public
   * @param string leaderboardId
   * @param int score
   * @param Object parameters
   * @param Object options
   */
  var submitScoreAndShowRankbox = function(leaderboardId, score, parameters, options) {
    submitScore(leaderboardId, score, parameters);
    var params = parameters || {};
    params.score = score;
    showRankbox(leaderboardId, params, options);
  };

  /**
   * Display a web client with the list of challenges of the player.
   * @visibility public
   * @param Object parameters
   * @param Object options
   */
  var showChallenges = function(parameters, options) {
    if (!isInitialized()) return;
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/challenges", params, options, defaultOpt);
  };

  /**
   * display a web client witht the details of a challenge instance
   * @visibility public
   * @param string instanceIf
   * @param Object parameters
   * @param Object options
   */
  var showChallengeInstance = function(instanceId, parameters, options) {
    if (!isInitialized()) return;
    var params = pushParameters({}, parameters);
    var defaultOpt = {style:'full'};
    WebClient.show("/web/challenges/instances/"+instanceId, params, options, defaultOpt);
  };


  /**
   * public API
   */
  return {
    get:RestClient.get,
    post:RestClient.post,
    reset:reset, // erase localStorage data
    initialize:initialize,
    // rest api
    ping:ping,
    submitScore:submitScore,
    getChallengeInstance:getChallengeInstance,
    getChallengeTurns:getChallengeTurns,
    submitChallengeTurn:submitChallengeTurn,
    submitChallengeTurnScore:submitChallengeTurnScore,
    // web api
    showWebClient:WebClient.show,
    closeWebClient:WebClient.close,
    showProfile:showProfile,
    showFriends:showFriends,
    showLeaderboard:showLeaderboard,
    showLeaderboardOverview:showLeaderboardOverview,
    showRankbox:showRankbox,
    submitScoreAndShowRankbox:submitScoreAndShowRankbox,
    showChallenges:showChallenges,
    showChallengeInstance:showChallengeInstance
  };

})();

return Scoreflex.SDK;

};