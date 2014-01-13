/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS=CryptoJS||function(g,l){var e={},d=e.lib={},m=function(){},k=d.Base={extend:function(a){m.prototype=this;var c=new m;a&&c.mixIn(a);c.hasOwnProperty("init")||(c.init=function(){c.$super.init.apply(this,arguments)});c.init.prototype=c;c.$super=this;return c},create:function(){var a=this.extend();a.init.apply(a,arguments);return a},init:function(){},mixIn:function(a){for(var c in a)a.hasOwnProperty(c)&&(this[c]=a[c]);a.hasOwnProperty("toString")&&(this.toString=a.toString)},clone:function(){return this.init.prototype.extend(this)}},
p=d.WordArray=k.extend({init:function(a,c){a=this.words=a||[];this.sigBytes=c!=l?c:4*a.length},toString:function(a){return(a||n).stringify(this)},concat:function(a){var c=this.words,q=a.words,f=this.sigBytes;a=a.sigBytes;this.clamp();if(f%4)for(var b=0;b<a;b++)c[f+b>>>2]|=(q[b>>>2]>>>24-8*(b%4)&255)<<24-8*((f+b)%4);else if(65535<q.length)for(b=0;b<a;b+=4)c[f+b>>>2]=q[b>>>2];else c.push.apply(c,q);this.sigBytes+=a;return this},clamp:function(){var a=this.words,c=this.sigBytes;a[c>>>2]&=4294967295<<
32-8*(c%4);a.length=g.ceil(c/4)},clone:function(){var a=k.clone.call(this);a.words=this.words.slice(0);return a},random:function(a){for(var c=[],b=0;b<a;b+=4)c.push(4294967296*g.random()|0);return new p.init(c,a)}}),b=e.enc={},n=b.Hex={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++){var d=c[f>>>2]>>>24-8*(f%4)&255;b.push((d>>>4).toString(16));b.push((d&15).toString(16))}return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f+=2)b[f>>>3]|=parseInt(a.substr(f,
2),16)<<24-4*(f%8);return new p.init(b,c/2)}},j=b.Latin1={stringify:function(a){var c=a.words;a=a.sigBytes;for(var b=[],f=0;f<a;f++)b.push(String.fromCharCode(c[f>>>2]>>>24-8*(f%4)&255));return b.join("")},parse:function(a){for(var c=a.length,b=[],f=0;f<c;f++)b[f>>>2]|=(a.charCodeAt(f)&255)<<24-8*(f%4);return new p.init(b,c)}},h=b.Utf8={stringify:function(a){try{return decodeURIComponent(escape(j.stringify(a)))}catch(c){throw Error("Malformed UTF-8 data");}},parse:function(a){return j.parse(unescape(encodeURIComponent(a)))}},
r=d.BufferedBlockAlgorithm=k.extend({reset:function(){this._data=new p.init;this._nDataBytes=0},_append:function(a){"string"==typeof a&&(a=h.parse(a));this._data.concat(a);this._nDataBytes+=a.sigBytes},_process:function(a){var c=this._data,b=c.words,f=c.sigBytes,d=this.blockSize,e=f/(4*d),e=a?g.ceil(e):g.max((e|0)-this._minBufferSize,0);a=e*d;f=g.min(4*a,f);if(a){for(var k=0;k<a;k+=d)this._doProcessBlock(b,k);k=b.splice(0,a);c.sigBytes-=f}return new p.init(k,f)},clone:function(){var a=k.clone.call(this);
a._data=this._data.clone();return a},_minBufferSize:0});d.Hasher=r.extend({cfg:k.extend(),init:function(a){this.cfg=this.cfg.extend(a);this.reset()},reset:function(){r.reset.call(this);this._doReset()},update:function(a){this._append(a);this._process();return this},finalize:function(a){a&&this._append(a);return this._doFinalize()},blockSize:16,_createHelper:function(a){return function(b,d){return(new a.init(d)).finalize(b)}},_createHmacHelper:function(a){return function(b,d){return(new s.HMAC.init(a,
d)).finalize(b)}}});var s=e.algo={};return e}(Math);
(function(){var g=CryptoJS,l=g.lib,e=l.WordArray,d=l.Hasher,m=[],l=g.algo.SHA1=d.extend({_doReset:function(){this._hash=new e.init([1732584193,4023233417,2562383102,271733878,3285377520])},_doProcessBlock:function(d,e){for(var b=this._hash.words,n=b[0],j=b[1],h=b[2],g=b[3],l=b[4],a=0;80>a;a++){if(16>a)m[a]=d[e+a]|0;else{var c=m[a-3]^m[a-8]^m[a-14]^m[a-16];m[a]=c<<1|c>>>31}c=(n<<5|n>>>27)+l+m[a];c=20>a?c+((j&h|~j&g)+1518500249):40>a?c+((j^h^g)+1859775393):60>a?c+((j&h|j&g|h&g)-1894007588):c+((j^h^
g)-899497514);l=g;g=h;h=j<<30|j>>>2;j=n;n=c}b[0]=b[0]+n|0;b[1]=b[1]+j|0;b[2]=b[2]+h|0;b[3]=b[3]+g|0;b[4]=b[4]+l|0},_doFinalize:function(){var d=this._data,e=d.words,b=8*this._nDataBytes,g=8*d.sigBytes;e[g>>>5]|=128<<24-g%32;e[(g+64>>>9<<4)+14]=Math.floor(b/4294967296);e[(g+64>>>9<<4)+15]=b;d.sigBytes=4*e.length;this._process();return this._hash},clone:function(){var e=d.clone.call(this);e._hash=this._hash.clone();return e}});g.SHA1=d._createHelper(l);g.HmacSHA1=d._createHmacHelper(l)})();
(function(){var g=CryptoJS,l=g.enc.Utf8;g.algo.HMAC=g.lib.Base.extend({init:function(e,d){e=this._hasher=new e.init;"string"==typeof d&&(d=l.parse(d));var g=e.blockSize,k=4*g;d.sigBytes>k&&(d=e.finalize(d));d.clamp();for(var p=this._oKey=d.clone(),b=this._iKey=d.clone(),n=p.words,j=b.words,h=0;h<g;h++)n[h]^=1549556828,j[h]^=909522486;p.sigBytes=b.sigBytes=k;this.reset()},reset:function(){var e=this._hasher;e.reset();e.update(this._iKey)},update:function(e){this._hasher.update(e);return this},finalize:function(e){var d=
this._hasher;e=d.finalize(e);d.reset();return d.finalize(this._oKey.clone().concat(e))}})})();
/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function () {
    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex != -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            var words = [];
            var nBytes = 0;
            for (var i = 0; i < base64StrLength; i++) {
                if (i % 4) {
                    var bits1 = map.indexOf(base64Str.charAt(i - 1)) << ((i % 4) * 2);
                    var bits2 = map.indexOf(base64Str.charAt(i)) >>> (6 - (i % 4) * 2);
                    words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                    nBytes++;
                }
            }

            return WordArray.create(words, nBytes);
        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };
}());
/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {
"use strict";

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());
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

var Scoreflex = {};

/**
 * Helper methods. Private to Scoreflex namespace.
 * @private
 * @namespace Scoreflex.Helper
 * @memberof module:Scoreflex
 */
Scoreflex.Helper = {
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
      evt = document.createEvent("HTMLEvents");
      evt.initEvent(eventType, true, true); // event type,bubbling,cancelable
      evt.data = data;
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
Scoreflex.SDK = (function(clientId, clientSecret, useSandbox) {
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
   * @param {object} callbacks
   * Callback functions are called in the scope (this keyword) of the
   * XMLHttpRequest object when available or the window object otherwise.
   * <br />- onload (Function) called on request success
   * <br />- onerror (Function) called on request failure
   * <br />- ontimeout (Function)
   * <br />- onabort (Function)
   * <br />- onloadend (Function)
   * @see See also {@link http://www.w3.org/TR/XMLHttpRequest2/#events|XMLHttpRequest2}

   * @public
   * @class Handlers
   * @memberof module:Scoreflex.SDK
   */
  var Handlers = function(callbacks){
    return handlers;
  };
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
     * ScoreflexEvent with name: "session"
     * @param {boolean} login - true on login event
     * @param {boolean} logout - true on logout event
     * @return {ScoreflexEvent}
     *
     * @event ScoreflexSessionEvent
     * @memberof module:Scoreflex.SDK.Events
     */
    ScoreflexSessionEvent: function(login, logout) {
      return {
        name: "session",
        login: login,
        logout: logout
      };
    },

    /**
     * ScoreflexEvent with name: "play"
     * @param {module:Scoreflex.SDK.Leaderboard} leaderboard - Leaderboard instance
     * @return {ScoreflexEvent}
     *
     * @event ScoreflexPlayEvent
     * @memberof module:Scoreflex.SDK.Events
     */
    ScoreflexPlayEvent: function(leaderboard) {
      return {
        name: "play",
        leaderboard: Leaderboard
      };
    },

    /**
     * ScoreflexEvent with name: "challenge"
     * @param {module:Scoreflex.SDK.ChallengeInstance} challenge - ChallengeIntance instance
     * @return {ScoreflexEvent}
     *
     * @event ScoreflexChallengeEvent
     * @memberof module:Scoreflex.SDK.Events
     */
    ScoreflexChallengeEvent: function(challenge) {
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
      Scoreflex.Helper.fireEvent(window, 'ScoreflexEvent', eventData);
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
  var RestClient = (function() {
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
      params.lang = Scoreflex.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
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

    return{
      post:post,
      get:get
    };
  })();
  //-- REST API end


  //-- WEB API
  /**
   * Namespace: WebClient
   * @protected
   * @namespace WebClient
   * @memberof module:Scoreflex.SDK
   */
  var WebClient = (function(){

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
          Events.fire(Event.ScoreflexSessionEvent(false, true));
          break;

        case '200001': // close
          close(iframeId);
          break;

        case '200002': // play leaderboard
          var leaderboardId = data.leaderboardId;
          Events.fire(Event.ScoreflexLeaderboardEvent(Leaderboards.get(leaderboardId)));
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
          Events.fire(Event.ScoreflexChallengeEvent(Challenges.get(challengeInstanceId, challengeConfigId)));
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
      params.lang = Scoreflex.Helper.inArray(lang, VALID_LANGUAGE_CODES) ? lang : 'en';
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

    return {
      show:show,
      close:close
    };
  })();
  //-- WEB API end


  //-- STORAGE
  /**
   * Storage using localStorage.
   * @private
   * @namespace Storage
   * @memberof module:Scoreflex.SDK
   */
  var Storage = (function(){
    _ns = 'SFX_';
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

    return {
      get:get,
      set:set,
      rm:rm
    };
  })();
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
  var Player = function(playerId, data) {
    /**
     * Return the player's identifier (playerId).
     * @return {string} Player ID
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Player
     */
    var getId = function() {
      return playerId;
    };

    /**
     * Return the player raw data.
     * @return {object}
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Player
     */
    var getData = function() {
      return data || {};
    };

    /**
     * Return the player's nickname.
     * @return {string} nickname
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Player
     */
    var getNickname = function() {
      return getData().nickName || '';
    };

    /**
     * Display a web client with the profile of the player.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Player
     */
    var showProfile = function(parameters, options) {
      Players.showProfile(playerId, parameters, options);
    };

    /**
     * Display a web client with the list of friends of the player.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Player
     */
    var showFriends = function(parameters, options) {
      showPlayerFriends(playerId, parameters, options);
    };

    return {
      getId:getId,
      getData:getData,
      getNickname:getNickname,
      showProfile:showProfile,
      showFriends:showFriends
    };
  };
  //-- Player object end


  //-- Players static
  /**
   * Object to get and manipulate players.
   * @public
   * @namespace Players
   * @memberof module:Scoreflex.SDK
   */
  var Players = (function() {
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
      return Player(playerId, data);
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
      if (!isInitialized()) return;
      if (handlers === undefined) handlers = {};

      if (!noCache && cache[playerId]) {
        if (handlers.onload) {
          var p = Player(playerId, cache[playerId]);
          setTimeout(function(){handlers.onload.call(null, p);}, 0);
        }
      }
      else {
        var i_onload = handlers.onload;
        handlers.onload = function() {
          var json = this.responseJSON || {};
          cache[playerId] = json;
          var p = Player(playerId, json);
          i_onload.call(this, p);
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
      if (!isInitialized()) return;
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
      if (!isInitialized()) return;
      if (playerId === undefined) playerId = 'me';
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/players/"+playerId+"/friends", params, options, defaultOpt);
    };

    return  {
      get:get,
      getCurrent:getCurrent,
      showProfile:showProfile,
      showFriends:showFriends
    };
  })();
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
  var Leaderboard = function(leaderboardId) {
    /**
     * Return the leaderboard identifier (leaderboardId).
     * @return {string} Leaderboard ID
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var getId = function() {
      return leaderboardId;
    };

    /**
     * Send a score to a leaderboard.
     * @param {int} score - raw score
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var submitScore = function(score, parameters, handlers) {
      if (!isInitialized()) return;
      var params = {score:score};
      params = pushParameters(params, parameters);
      var body = undefined;
      RestClient.post("/scores/"+leaderboardId, params, body, handlers);
    };

    /**
     * Display a web client for the requested leaderboard.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var show = function(parameters, options) {
      if (!isInitialized()) return;
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/leaderboards/"+leaderboardId, params, options, defaultOpt);
    };

    /**
     * Display a web client for the requested leaderboard overview.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var showOverview = function(parameters, options) {
      if (!isInitialized()) return;
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/leaderboards/"+leaderboardId+"/overview", params, options, defaultOpt);
    };

    /**
     * Display a web client with the current player's score for the requested
     * leaderboard.
     * @param {object} parameters - (facultative, the last score of the player} 'score':{int}
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var showRankbox = function(parameters, options) {
      if (!isInitialized()) return;
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'panel'};
      WebClient.show("/web/scores/"+leaderboardId+"/ranks", params, options, defaultOpt);
    };

    /**
     * Put a score and show the rankbox. The rankbox takes into account
     * the score.
     * @param {int} score - raw score
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.Leaderboard
     */
    var submitScoreAndShowRankbox = function(score, parameters, options) {
      submitScore(score, parameters);
      var params = parameters || {};
      params.score = score;
      showRankbox(params, options);
    };

    return {
      getId:getId,
      submitScore:submitScore,
      show:show,
      showOverview:showOverview,
      showRankbox:showRankbox,
      submitScoreAndShowRankbox:submitScoreAndShowRankbox
    };
  };
  //-- Leaderboard object end


  //-- Leaderboards static
  /**
   * Object to get and manipulate leaderboards.
   * @public
   * @namespace Leaderboards
   * @memberof module:Scoreflex.SDK
   */
  var Leaderboards = (function() {
    /**
     * Get a Leaderboard instance
     * @return {module:Scoreflex.SDK.Leaderboard} Leaderboard instance
     *
     * @public
     * @memberof module:Scoreflex.SDK.Leaderboards
     */
    var get = function(leaderboardId) {
      return Leaderboard(leaderboardId);
    };

    return {
      get:get
    };
  })();
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
  var ChallengeInstance = function(instanceId, configId) {
    var cache_players = null;

    /**
     * Return the challenge instance identifier (challengeInstanceId).
     * @return {string} Challenge instance ID
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var getInstanceId = function() {
      return instanceId;
    };

    /**
     * Return the challenge configuration identifier of the
     * instance (challengeConfigId).
     * @return {string} Challenge configuration ID
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var getConfigId = function() {
      return configId;
    };

    /**
     * Get details of the challenge.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var getDetails = function(parameters, handlers) {
      if (!isInitialized()) return;
      var params = pushParameters(params, parameters);
      RestClient.get("/challenges/instances/"+challengeInstanceId, params, handlers);
    };

    /**
     * Request challenge players and call the onload handler with a
     * list of {@link Player}.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     * @param {boolean} noCache - if true, bypass the local cache
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var getPlayers = function(parameters, handlers, noCache) {
      if (handlers === undefined) handlers = {};
      if (!noCache && cache_participants !== null) {
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
            for (id in participants) {
              count++;
              players[id] = Player(id, {});
            }
            var incrementalHandler = function(pjson) {
              received++;
              if (pjson.id) {
                players[pjson.id] = Player(pjson.id, pjson);
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
        getDetails(parameters, detailsHandlers);
      }
    };

    /**
     * Get turn details of a challenge instance.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var getTurns = function(parameters, handlers) {
      if (!isInitialized()) return;
      var params = pushParameters(params, parameters);
      RestClient.get("/challenges/instances/"+instanceId+"/turns", params, handlers);
    };

    /**
     * Generic function to submit a challenge player's turn.
     * @param {object} turnBody - {@link http://developer.scoreflex.com/docs}
     * @param {object} parameters - key/value pair of query string parameters
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @todo set link to challenge's turns documentation
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var submitTurn = function(turnBody, parameters, handlers) {
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
     * Specialized function to submit a challenge player's turn with score only.
     * @param {int} score - raw score
     * @param {object} parameters - (facultative, the score metadata) 'meta':{string}
     * @param {module:Scoreflex.SDK.Handlers} handlers - request callbacks
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var submitTurnScore = function(score, parameters, handlers) {
      var turnBody = {score:score};
      submitChallengeTurn(instanceId, turnBody, parameters, handlers);
    };

    /**
     * Display a web client with the details of a challenge instance.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @instance
     * @memberof module:Scoreflex.SDK.ChallengeInstance
     */
    var showDetails = function(parameters, options) {
      if (!isInitialized()) return;
      var params = pushParameters({}, parameters);
      var defaultOpt = {style:'full'};
      WebClient.show("/web/challenges/instances/"+instanceId, params, options, defaultOpt);
    };

    return {
      getInstanceId:getInstanceId,
      getConfigId:getConfigId,
      getDetails:getDetails,
      getPlayers:getPlayers,
      getTurns:getTurns,
      submitTurn:submitTurn,
      submitTurnScore:submitTurnScore,
      showDetails:showDetails
    };
  };
  //-- ChallengeInstance object end


  //-- Challenges static
  /**
   * Object to get and manipulate challenges.
   * @public
   * @namespace Challenges
   * @memberof module:Scoreflex.SDK
   */
  var Challenges = (function() {
    var cache = {};

    /**
     * Display a web client with the list of challenges of the player.
     * @param {object} parameters - key/value pair of query string parameters
     * @param {object} options - key/value pair of WebClient options
     *
     * @public
     * @memberof module:Scoreflex.SDK.Challenges
     */
    var showChallenges = function(parameters, options) {
      if (!isInitialized()) return;
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
      return Challenge(challengeInstanceId, challengeConfigId);
    };

    return  {
      showChallenges:showChallenges,
      get:get
    };
  })();
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
      deviceId:Scoreflex.Helper.getDeviceId()
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
        Events.fire(Event.ScoreflexSessionEvent(true, false));
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

      fetchAnonymousAccessTokenIfNeeded();
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
    if (!isInitialized()) return;
    var session = getSession();
    if (session.anonymous === true) {
      var context = getContext();
      var params = {
        clientId: context.clientId,
        devicePlatform: 'Web',
        deviceModel: window.navigator.userAgent || 'browser',
        deviceId:Scoreflex.Helper.getDeviceId(),
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

  initialize(clientId, clientSecret, useSandbox);

  return {
    // misc
    reset:reset, // delete localStorage session data
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

return Scoreflex.SDK;

};