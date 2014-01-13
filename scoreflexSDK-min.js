var Scoreflex=function(E,F,R){var w;w={inArray:function(f,p){for(var m=0;m<p.length;m++)if(p[m]===f)return!0;return!1},rawurlencode:function(f){f=(f+"").toString();return encodeURIComponent(f).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A")},getUUID:function(){var f=Array(31);if(window.crypto&&crypto.getRandomValues){var p=new Uint8Array(31);crypto.getRandomValues(p);for(var m=0;31>m;m++)f[m]=p[m]&15}else for(m=0;31>m;m++)f[m]=16*Math.random()|
0;var q=0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(m){var p=f[q++];return("x"==m?p:p&3|8).toString(16)})},getDeviceId:function(){var f;window.localStorage&&(f=localStorage.getItem("deviceId"));f||(f=this.getUUID()+"-"+(+new Date).toString(16),window.localStorage&&localStorage.setItem("deviceId",f));return f},fireEvent:function(f,p,m){var q;if(document.createEventObject)return q=document.createEventObject(),q.data=m,f.fireEvent("on"+p,q);q=document.createEvent("HTMLEvents");
q.initEvent(p,!0,!0);q.data=m;return!f.dispatchEvent(q)}};return function(f,p,m){var q="af ar be bg bn ca cs da de el en en_GB en_US es es_ES es_MX et fa fi fr fr_FR fr_CA he hi hr hu id is it ja ko lt lv mk ms nb nl pa pl pt pt_PT pt_BR ro ru sk sl sq sr sv sw ta th tl tr uk vi zh zh_CN zh_TW zh_HK".split(" "),r=!1,A=null,L=null,G=!0,H=function(){var a=function(a,b){var d=new XMLHttpRequest;"withCredentials"in d?d.open(a,b,!0):"undefined"!=typeof XDomainRequest?(d=new XDomainRequest,d.open(a,b)):
d=null;return d},c=function(a,b){return a.k==b.k?a.v<b.v?-1:1:a.k<b.k?-1:1};return{request:function(c,b,d,l,h,g){var s=a(c,b);if(void 0!==h)for(var t in h)s.setRequestHeader(t,h[t]);if(s){if(g)for(t=["onerror","ontimeout","onabort","onloadend"],b=0;b<t.length;b++)g[t[b]]&&(s[t[b]]=g[t[b]]);s.onload=function(){if(g){try{var a;a:{try{a=JSON.parse(this.responseText);break a}catch(b){}a=null}s.responseJSON=a}catch(d){}200==this.status&&g.onload?g.onload.apply(this,arguments):g.onerror&&g.onerror.apply(this,
arguments)}};"POST"===c?s.send(d):s.send()}},getSignature:function(a,b,d,l){void 0===l&&(l="");void 0===d&&(d=[]);var h,g=document.createElement("a");g.href=b;b=g.protocol.substr(0,g.protocol.length-1).toLowerCase();var s=g.hostname.toLowerCase(),t=g.pathname,g=g.search;0<g.length&&"?"===g[0]&&(g=g.substr(1));var g=g.split("&"),x=[],f;for(h=0;h<g.length;h++)""!==g[h]&&(f=g[h].split("=",2),x.push({k:f[0],v:f[1]}));var g=w.rawurlencode,n;for(n in d)x.push({k:g(n),v:g(d[n])});x.sort(c);d=[];for(h=0;h<
x.length;h++)d.push(x[h].k+"="+x[h].v);d=d.join("&");a=a+"&"+g(b+"://"+s+t)+"&"+g(d)+"&"+g(l);a=CryptoJS.HmacSHA1(a,L).toString(CryptoJS.enc.Base64);return'Scoreflex sig="'+g(a)+'", meth="0"'}}}(),B={ScoreflexSessionEvent:function(a,c){return{name:"session",login:a,logout:c}},ScoreflexPlayEvent:function(a){return{name:"play",leaderboard:M}},ScoreflexChallengeEvent:function(a){return{name:"challenge",challenge:a}},fire:function(a){w.fireEvent(window,"ScoreflexEvent",a)}},z=function(){var a=function(a){return(G?
"https://sandbox.api.scoreflex.com":"https://api.scoreflex.com")+"/v1"+a},c=function(a){void 0===a&&(a={});var d=y()||{},c=d.lang||window.navigator.language;a.lang=w.inArray(c,q)?c:"en";d.accessToken&&(a.accessToken=d.accessToken);return a},e=function(a){var d=[],c;for(c in a)d.push(encodeURIComponent(c)+"="+encodeURIComponent(a[c]));return d.join("&")};return{post:function(b,d,l,f){d=c(d);b=a(b);var g=e(d);d={"Content-type":"application/x-www-form-urlencoded","X-Scoreflex-Authorization":H.getSignature("POST",
b,d,l)};H.request("POST",b,g,l,d,f)},get:function(b,d,l){d=c(d);b=a(b);(d=e(d))&&(b=b+"?"+d);H.request("GET",b,{},void 0,{},l)}}}(),v=function(){var a={},c={},e=[],b=function(b){if(!a[b]){var d=document.createElement("iframe");d.id="scoreflexWebClient_"+b;a[b]=d;d.onload=function(){c[b]=d.contentWindow}}return a[b]},d=function(a){for(var b=0;b<e.length;b++)if(e[b]===a){e.splice(b,1);break}},l=null;window.addEventListener("message",function(a){if("https://api.scoreflex.com"==a.origin||"https://sandbox.api.scoreflex.com"==
a.origin){var b=a.data;if(b!==l){l=b;var d=document.createElement("a");d.href=b;if("/v1/web/callback"==d.pathname){b=d.search;0<b.length&&"?"==b[0]&&(b=b.substr(1));var d=b.split("&"),b={},e,n,k;for(n=0;n<d.length;n++)d[n]&&(e=d[n].split("=",2),b[e[0]]=e[1]);d=null;for(k in c)if(a.source===c[k]){d=k;break}a=d;d=b.code;k=b.data?JSON.parse(decodeURIComponent(b.data)):{};switch(d){case "200000":g(a);C(null,!0);N();B.fire(Event.ScoreflexSessionEvent(!1,!0));break;case "200001":g(a);break;case "200002":B.fire(Event.ScoreflexLeaderboardEvent(O.get(k.leaderboardId)));
g(a);break;case "200003":g(a);r&&(a=y(),!0===a.anonymous&&(k={clientId:A,devicePlatform:"Web",deviceModel:window.navigator.userAgent||"browser",deviceId:w.getDeviceId(),state:P(!0)},a.accessToken&&(k.anonymousAccessToken=a.accessToken,k.forceMerge="true"),k=u(k,void 0),v.show("/oauth/web/authorize",k,void 0,{style:"full",noSid:!0})));break;case "200004":b=k.code;k=k.state;g(a);F({code:b,state:k});break;case "200005":b=k.url;k=k.mode;g(a);f(b,{},{style:k});break;case "200006":g(a);break;case "200007":b=
k.challengeInstanceId;k=k.challengeConfigId;g(a);B.fire(Event.ScoreflexChallengeEvent(Q.get(b,k)));break;case "200008":g(a);break;case "200009":g(a);break;case "200010":g(a)}}}}},!1);var f=function(a,c,f,l){f=f||{};if(void 0!==l)for(var n in l)void 0===f[n]&&(f[n]=l[n]);l=c;if(-1!==a.indexOf("://"))c=a;else if(c=G,y().sid){n=f;void 0===l&&(l={});void 0===n&&(n={});var k=y()||{},m=k.lang||window.navigator.language;l.lang=w.inArray(m,q)?m:"en";k.sid&&!n.noSid&&(l.sid=k.sid);n=[];for(var h in l)n.push(encodeURIComponent(h)+
"="+encodeURIComponent(l[h]));h=n.join("&");c=(c?"https://sandbox.api.scoreflex.com":"https://api.scoreflex.com")+"/v1"+a+"?"+h}else c=null;c?(a=f.id||f.style||"full",h=b(a),h.src=c+"#start",f="scoreflexWebClient_"+f.style,void 0!==f&&(c=h.getAttribute("data-stylename"),c!==f&&(h.classList.remove(c),h.classList.add(f),h.setAttribute("data-stylename",f))),document.body.appendChild(h),d(a),e.push(a)):g()},g=function(a){var c;a||(a=0<e.length?e[e.length-1]:null);a&&(c=b(a))&&c.parentNode&&(c.parentNode.removeChild(c),
d(a))};return{show:f,close:g}}(),D=function(){_ns="SFX_";return{get:function(a){return(a=localStorage.getItem(_ns+a))?JSON.parse(a):null},set:function(a,c){var e=JSON.stringify(c);return localStorage.setItem(_ns+a,e)},rm:function(a){return localStorage.removeItem(_ns+a)}}}(),J=function(a,c){var e=function(){return c||{}};return{getId:function(){return a},getData:e,getNickname:function(){return e().nickName||""},showProfile:function(b,c){I.showProfile(a,b,c)},showFriends:function(b,c){showPlayerFriends(a,
b,c)}}},I=function(){var a={};return{get:function(c,e,b,d){if(r)if(void 0===b&&(b={}),!d&&a[c]){if(b.onload){var f=J(c,a[c]);setTimeout(function(){b.onload.call(null,f)},0)}}else{var h=b.onload;b.onload=function(){var b=this.responseJSON||{};a[c]=b;b=J(c,b);h.call(this,b)};z.get("/players/"+c,e,b)}},getCurrent:function(){var a=(y()||{}).me||{};return J(a.id,a)},showProfile:function(a,e,b){r&&(void 0===a&&(a="me"),e=u({},e),v.show("/web/players/"+a,e,b,{style:"full"}))},showFriends:function(a,e,b){r&&
(void 0===a&&(a="me"),e=u({},e),v.show("/web/players/"+a+"/friends",e,b,{style:"full"}))}}}(),M=function(a){var c=function(b,d,c){r&&(b={score:b},b=u(b,d),z.post("/scores/"+a,b,void 0,c))},e=function(b,c){if(r){var e=u({},b);v.show("/web/scores/"+a+"/ranks",e,c,{style:"panel"})}};return{getId:function(){return a},submitScore:c,show:function(b,c){if(r){var e=u({},b);v.show("/web/leaderboards/"+a,e,c,{style:"full"})}},showOverview:function(b,c){if(r){var e=u({},b);v.show("/web/leaderboards/"+a+"/overview",
e,c,{style:"full"})}},showRankbox:e,submitScoreAndShowRankbox:function(a,d,f){c(a,d);d=d||{};d.score=a;e(d,f)}}},O=function(){return{get:function(a){return M(a)}}}(),Q=function(){return{showChallenges:function(a,c){if(r){var e=u({},a);v.show("/web/challenges",e,c,{style:"full"})}},get:function(a,c){return Challenge(a,c)}}}(),y=function(){var a=D.get("sessions");a||(a={});return a.player?a.player:a.anonymous},C=function(a,c){var e=D.get("sessions");e||(e={});!0===c?e.player=a:e.anonymous=a;D.set("sessions",
e)},K=null,P=function(a){if(!0===a||null===K)K="S"+ +new Date;return K},u=function(a,c){void 0===a&&(a={});if(void 0!==c)for(var e in c)a[e]=c[e];return a},E=function(a){var c={clientId:A,devicePlatform:"Web",deviceModel:window.navigator.userAgent||"browser",deviceId:w.getDeviceId()};z.post("/oauth/anonymousAccessToken",c,void 0,a)},N=function(){var a=y(),c={onload:function(){var a=this.responseJSON||{},b=(a.accessToken||{}).token||null,c=a.sid||null,a=a.me||{},f=a.id||null,h=a.language||null;b&&
c&&f&&C({anonymous:!0,accessToken:b,sid:c,playerId:f,lang:h,me:a},!1);r=!0},onerror:function(){}};a&&a.accessToken&&a.sid&&a.playerId?c.onload&&setTimeout(c.onload,0):E(c)},F=function(a){a.state===P()&&(a={code:a.code,clientId:A},handlers={onload:function(){var a=this.responseJSON||{},e=(a.accessToken||{}).token||null,b=a.sid||null,a=a.me||{},d=a.id||null,f=a.language||null;e&&b&&d&&(C({anonymous:!1,accessToken:e,sid:b,playerId:d,lang:f,me:a},!0),C(null,!1));I.showProfile();B.fire(Event.ScoreflexSessionEvent(!0,
!1))},onerror:function(){}},z.post("/oauth/accessToken",a,void 0,handlers))};(function(a,c,e){r||(A=a,L=c,G=e,N())})(f,p,m);return{reset:function(){D.rm("sessions")},RestClient:z,ping:function(a){z.get("/network/ping",{},a)},WebClient:v,Leaderboards:O,Players:I,Challenges:Q}}(E,F,R)};
