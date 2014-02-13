var Scoreflex=function(H,I,J){var y;y={inArray:function(l,q){for(var g=0;g<q.length;g++)if(q[g]===l)return!0;return!1},rawurlencode:function(l){l=(l+"").toString();return encodeURIComponent(l).replace(/!/g,"%21").replace(/'/g,"%27").replace(/\(/g,"%28").replace(/\)/g,"%29").replace(/\*/g,"%2A")},getUUID:function(){var l=Array(31);if(window.crypto&&crypto.getRandomValues){var q=new Uint8Array(31);crypto.getRandomValues(q);for(var g=0;31>g;g++)l[g]=q[g]&15}else for(g=0;31>g;g++)l[g]=16*Math.random()|
0;var s=0;return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(g){var q=l[s++];return("x"==g?q:q&3|8).toString(16)})},getDeviceId:function(){var l;window.localStorage&&(l=localStorage.getItem("deviceId"));l||(l=this.getUUID()+"-"+(+new Date).toString(16),window.localStorage&&localStorage.setItem("deviceId",l));return l},fireEvent:function(l,q,g){var s;if(document.createEventObject)return s=document.createEventObject(),s.data=g,l.fireEvent("on"+q,s);s=new CustomEvent(q,{detail:g,bubbles:!0,
cancelable:!0});return!l.dispatchEvent(s)}};return function(l,q,g){var s="af ar be bg bn ca cs da de el en en_GB en_US es es_ES es_MX et fa fi fr fr_FR fr_CA he hi hr hu id is it ja ko lt lv mk ms nb nl pa pl pt pt_PT pt_BR ro ru sk sl sq sr sv sw ta th tl tr uk vi zh zh_CN zh_TW zh_HK".split(" "),p=!1,K=Scoreflex.SessionState.INIT_UNSTARTED,C=null,O=null,D=!0,L=function(){var a=function(a,c){var b=new XMLHttpRequest;"withCredentials"in b?b.open(a,c,!0):"undefined"!=typeof XDomainRequest?(b=new XDomainRequest,
b.open(a,c)):b=null;return b},d=function(a,c){return a.k==c.k?a.v<c.v?-1:1:a.k<c.k?-1:1};return{request:function(d,c,b,h,k,f){var u=a(d,c);if(void 0!==k)for(var v in k)u.setRequestHeader(v,k[v]);if(u){if(f)for(v=["onerror","ontimeout","onabort","onloadend"],c=0;c<v.length;c++)f[v[c]]&&(u[v[c]]=f[v[c]]);u.onload=function(){if(f){try{var c;a:{try{c=JSON.parse(this.responseText);break a}catch(b){}c=null}u.responseJSON=c}catch(a){}200==this.status&&f.onload?f.onload.apply(this,arguments):f.onerror&&f.onerror.apply(this,
arguments)}};"POST"===d?u.send(b):u.send()}},getSignature:function(a,c,b,h){void 0===h&&(h="");void 0===b&&(b=[]);var k,f=document.createElement("a");f.href=c;c=f.protocol.substr(0,f.protocol.length-1).toLowerCase();var u=f.hostname.toLowerCase(),v=f.pathname,f=f.search;0<f.length&&"?"===f[0]&&(f=f.substr(1));var f=f.split("&"),A=[],l;for(k=0;k<f.length;k++)""!==f[k]&&(l=f[k].split("=",2),A.push({k:l[0],v:l[1]}));var f=y.rawurlencode,n;for(n in b)A.push({k:f(n),v:f(b[n])});A.sort(d);b=[];for(k=0;k<
A.length;k++)b.push(A[k].k+"="+A[k].v);b=b.join("&");a=a+"&"+f(c+"://"+u+v)+"&"+f(b)+"&"+f(h);a=CryptoJS.HmacSHA1(a,O).toString(CryptoJS.enc.Base64);return'Scoreflex sig="'+f(a)+'", meth="0"'}}}(),t={ScoreflexSessionEvent:function(){return{name:"session",state:K}},ScoreflexPlayerEvent:function(){var a=z()||{};return{name:"player",player:a.me,anonymous:a.anonymous}},ScoreflexPlayEvent:function(a){return{name:"play",leaderboard:a}},ScoreflexChallengeEvent:function(a){return{name:"challenge",challenge:a}},
fire:function(a){y.fireEvent(window,"ScoreflexEvent",a)}},w=function(){var a=function(a){return(D?"https://sandbox.api.scoreflex.com":"https://api.scoreflex.com")+"/v1"+a},d=function(a){void 0===a&&(a={});var b=z()||{},d=b.lang||window.navigator.language;a.lang=y.inArray(d,s)?d:"en";b.accessToken&&(a.accessToken=b.accessToken);return a},e=function(a){var b=[],d;for(d in a)b.push(encodeURIComponent(d)+"="+encodeURIComponent(a[d]));return b.join("&")};return{post:function(c,b,h,k){b=d(b);c=a(c);var f=
e(b);b={"Content-type":"application/x-www-form-urlencoded","X-Scoreflex-Authorization":L.getSignature("POST",c,b,h)};L.request("POST",c,f,h,b,k)},get:function(c,b,h){b=d(b);c=a(c);(b=e(b))&&(c=c+"?"+b);L.request("GET",c,{},void 0,{},h)}}}(),x=function(){var a={},d={},e=[],c=function(b){if(!a[b]){var c=document.createElement("iframe");c.id="scoreflexWebClient_"+b;a[b]=c;c.onload=function(){d[b]=c.contentWindow}}return a[b]},b=function(a){for(var b=0;b<e.length;b++)if(e[b]===a){e.splice(b,1);break}},
h=null;window.addEventListener("message",function(a){if("https://api.scoreflex.com"==a.origin||"https://sandbox.api.scoreflex.com"==a.origin){var b=a.data;if(b!==h){h=b;var c=document.createElement("a");c.href=b;if("/v1/web/callback"==c.pathname){b=c.search;0<b.length&&"?"==b[0]&&(b=b.substr(1));var c=b.split("&"),b={},e,n,m;for(n=0;n<c.length;n++)c[n]&&(e=c[n].split("=",2),b[e[0]]=e[1]);c=null;for(m in d)if(a.source===d[m]){c=m;break}a=c;c=b.code;m=b.data?JSON.parse(decodeURIComponent(b.data)):{};
switch(c){case "200000":f(a);E(null,!0);P();break;case "200001":f(a);break;case "200002":t.fire(t.ScoreflexPlayEvent(Q.get(m.leaderboardId)));f(a);break;case "200003":f(a);p&&(a=z(),!0===a.anonymous&&(m={clientId:C,devicePlatform:"Web",deviceModel:window.navigator.userAgent||"browser",deviceId:y.getDeviceId(),state:R(!0)},a.accessToken&&(m.anonymousAccessToken=a.accessToken,m.forceMerge="true"),m=r(m,void 0),x.show("/oauth/web/authorize",m,void 0,{style:"full",noSid:!0})));break;case "200004":b=m.code;
m=m.state;f(a);T({code:b,state:m});break;case "200005":b=m.url;m=m.mode;f(a);k(b,{},{style:m});break;case "200006":f(a);break;case "200007":b=m.challengeInstanceId;m=m.challengeConfigId;f(a);t.fire(t.ScoreflexChallengeEvent(S.get(b,m)));break;case "200008":f(a);break;case "200009":f(a);break;case "200010":f(a)}}}}},!1);var k=function(a,d,h,k){h=h||{};if(void 0!==k)for(var n in k)void 0===h[n]&&(h[n]=k[n]);k=d;if(-1!==a.indexOf("://"))d=a;else if(d=D,z().sid){n=h;void 0===k&&(k={});void 0===n&&(n=
{});var m=z()||{},l=m.lang||window.navigator.language;k.lang=y.inArray(l,s)?l:"en";m.sid&&!n.noSid&&(k.sid=m.sid);n=[];for(var g in k)n.push(encodeURIComponent(g)+"="+encodeURIComponent(k[g]));g=n.join("&");d=(d?"https://sandbox.api.scoreflex.com":"https://api.scoreflex.com")+"/v1"+a+"?"+g}else d=null;d?(a=h.id||h.style||"full",g=c(a),g.src=d+"#start",h="scoreflexWebClient_"+h.style,void 0!==h&&(d=g.getAttribute("data-stylename"),d!==h&&(g.classList.remove(d),g.classList.add(h),g.setAttribute("data-stylename",
h))),document.body.appendChild(g),b(a),e.push(a)):f()},f=function(a){var d;a||(a=0<e.length?e[e.length-1]:null);a&&(d=c(a))&&d.parentNode&&(d.parentNode.removeChild(d),b(a))};return{show:k,close:f}}(),F=function(){var a="SFX_"+l+"_"+(g?"1":"0");return{get:function(d){return(d=localStorage.getItem(a+d))?JSON.parse(d):null},set:function(d,e){var c=JSON.stringify(e);return localStorage.setItem(a+d,c)},rm:function(d){return localStorage.removeItem(a+d)}}}(),B=function(a,d){var e=function(){return d||
{}},c=function(a){return e()[a]};return{getId:function(){return a},getData:e,setData:function(a){d=a},getValue:c,getNickname:function(){return c("nickName")||""},getAvatarUrl:function(){var b=c("avatarUrl");return b?b:"https://www.scoreflex.com/"+(D?"sandbox/":"")+"avatars/players/"+a+"/"},getGeo:function(a){var d=c("geo")||{};return void 0!==a?d[a]||"":d},showProfile:function(b,c){G.showProfile(a,b,c)},showFriends:function(b,c){showPlayerFriends(a,b,c)}}},G=function(){var a={};return{get:function(d,
e,c,b){if(p)if(void 0===c&&(c={}),!b&&a[d]){if(c.onload){var h=B(d,a[d]);setTimeout(function(){c.onload.call(null,h)},0)}}else{var k=c.onload;c.onload=function(){var b=this.responseJSON||{};a[d]=b;b=B(d,b);k.call(this,b)};w.get("/players/"+d,e,c)}},getCurrent:function(){var a=(z()||{}).me||{};return B(a.id,a)},showProfile:function(a,e,c){p&&(void 0===a&&(a="me"),e=r({},e),x.show("/web/players/"+a,e,c,{style:"full"}))},showFriends:function(a,e,c){p&&(void 0===a&&(a="me"),e=r({},e),x.show("/web/players/"+
a+"/friends",e,c,{style:"full"}))}}}(),H=function(a){var d=function(c,b,d){p&&(c={score:c},c=r(c,b),w.post("/scores/"+a,c,void 0,d))},e=function(c,b){if(p){var d=r({},c);x.show("/web/scores/"+a+"/ranks",d,b,{style:"panel"})}};return{getId:function(){return a},submitScore:d,show:function(c,b){if(p){var d=r({},c);x.show("/web/leaderboards/"+a,d,b,{style:"full"})}},showOverview:function(c,b){if(p){var d=r({},c);x.show("/web/leaderboards/"+a+"/overview",d,b,{style:"full"})}},showRankbox:e,submitScoreAndShowRankbox:function(a,
b,h){d(a,b);b=b||{};b.score=a;e(b,h)}}},Q=function(){return{get:function(a){return H(a)}}}(),I=function(a,d){var e=null,c=function(b,c){if(p){var d=r(d,b);w.get("/challenges/instances/"+a,d,c)}},b=function(d,e,f){if(p)if(d&&void 0!==d.turnSequence){var g={body:JSON.stringify(d)},g=r(g,e);w.post("/challenges/instances/"+a+"/turns",g,void 0,f)}else c({fields:"turn"},{onload:function(){var a=d||{};a.turnSequence=((this.responseJSON||{}).turn||{}).sequence||0;b(a,e,f)},onerror:(f||{}).onerror})};return{getInstanceId:function(){return a},
getConfigId:function(){return d},getDetails:c,getPlayers:function(a,b,d){void 0===b&&(b={});d||null===cache_participants?c(a,{onload:function(){var a=(this.responseJSON||{}).participants||{},d={},c=0,f=0,h;for(h in a)c++,d[h]=B(h,{});var g=function(a){f++;a.id&&(d[a.id]=B(a.id,a));f>=c&&(e=d,setTimeout(function(){b.onload.call(null,d)},0))};for(h in a)G.get(h,{},{onload:function(){g(this.responseJSON||{})}})},onerror:function(){b.onerror&&handler.onerror.apply(this,arguments)}}):b.onload&&setTimeout(function(){b.onload.call(null,
e)},0)},getTurns:function(b,d){if(p){var c=r(c,b);w.get("/challenges/instances/"+a+"/turns",c,d)}},submitTurn:b,submitTurnScore:function(a,d,c){b({score:a},d,c)},showDetails:function(b,d){if(p){var c=r({},b);x.show("/web/challenges/instances/"+a,c,d,{style:"full"})}}}},S=function(){return{showChallenges:function(a,d){if(p){var e=r({},a);x.show("/web/challenges",e,d,{style:"full"})}},get:function(a,d){return I(a,d)}}}(),z=function(){var a=F.get("sessions");a||(a={});return a.player?a.player:a.anonymous},
E=function(a,d){var e=F.get("sessions");e||(e={});!0===d?e.player=a:e.anonymous=a;F.set("sessions",e)},M=function(a){K=a;t.fire(t.ScoreflexSessionEvent())},N=null,R=function(a){if(!0===a||null===N)N="S"+ +new Date;return N},r=function(a,d){void 0===a&&(a={});if(void 0!==d)for(var e in d)a[e]=d[e];return a},J=function(a){var d={clientId:C,devicePlatform:"Web",deviceModel:window.navigator.userAgent||"browser",deviceId:y.getDeviceId()};w.post("/oauth/anonymousAccessToken",d,void 0,a)},P=function(a,d){var e=
z(),c={onload:function(){var b=this.responseJSON||{},d=(b.accessToken||{}).token||null,c=b.sid||null,b=b.me||{},e=b.id||null,g=b.language||null;d&&c&&e&&E({anonymous:!0,accessToken:d,sid:c,playerId:e,lang:g,me:b},!1);t.fire(t.ScoreflexPlayerEvent());a&&a()},onerror:function(){d&&d()}};e&&e.accessToken&&e.sid&&e.playerId?c.onload&&setTimeout(c.onload,0):J(c)},T=function(a){a.state===R()&&w.post("/oauth/accessToken",{code:a.code,clientId:C},void 0,{onload:function(){var a=this.responseJSON||{},e=(a.accessToken||
{}).token||null,c=a.sid||null,a=a.me||{},b=a.id||null,g=a.language||null;e&&c&&b&&(E({anonymous:!1,accessToken:e,sid:c,playerId:b,lang:g,me:a},!0),E(null,!1));G.showProfile();t.fire(t.ScoreflexPlayerEvent())},onerror:function(){}})};(function(a,d,e){p||(C=a,O=d,D=e,M(Scoreflex.SessionState.INIT_INPROGRESS),P(function(){p=!0;M(Scoreflex.SessionState.INIT_SUCCESS)},function(){M(Scoreflex.SessionState.INIT_FAILED)}))})(l,q,g);return{reset:function(){F.rm("sessions")},getSessionState:function(){return K},
RestClient:w,ping:function(a){w.get("/network/ping",{},a)},WebClient:x,Leaderboards:Q,Players:G,Challenges:S}}(H,I,J)};Scoreflex.SessionState={INIT_FAILED:-1,INIT_UNSTARTED:0,INIT_INPROGRESS:1,INIT_SUCCESS:2};
