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
 * Broswer requirements / module dependancies
 * - Scoreflex SDK
 * - browser support for Websockets
 */

/**
 * Code related to the realtime service.
 *
 * @memberof module:Scoreflex
 * @namespace Realtime
 * @public
 */
Scoreflex.Realtime = {};

/*=============================== Enums ================================*/
/**
 * Describes status code used in realtime callbacks.
 *
 * @readonly
 * @enum {integer}
 * @alias StatusCode
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.StatusCode = {
    /**
     * The status code used in callbacks when an operation was successful.
     */
    STATUS_SUCCESS : 0,

    /**
     * The status code used in callbacks when an unexpected error occurred.
     */
    STATUS_INTERNAL_ERROR: 1,

    /**
     * The status code used in callbacks when a network error occurred.
     */
    STATUS_NETWORK_ERROR: 2,

    /**
     * The status code used in [ConnectionListener.onConnectionClosed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionClosed} when the
     * player's session is closed on the server side.
     */
    STATUS_SESSION_CLOSED: 3,

    /**
     * The status code used used in
     * [ConnectionListener.onConnectionClosed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionClosed} when the
     * current connection is closed by a new one.
     */
    STATUS_REPLACED_BY_NEW_CONNECTION: 4,

    /**
     * The status code used in [ConnectionListener.onReconnecting]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onReconnecting} when the
     * server requests the client to reconnect on a specific host.
     */
    STATUS_NEW_SERVER_LOCATION: 5,

    /**
     * The status code used in [ConnectionListener.onConnectionFailed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionFailed} or
     * [MessageSentListener.onFailure]{@link
     * module:Scoreflex.Realtime.MessageSentListener.onFailure} when a malformed
     * message is sent by the player.
     */
    STATUS_INVALID_MESSAGE: 6,

    /**
     * The status code used in [ConnectionListener.onConnectionFailed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionFailed} when an
     * unknown message was sent to the server.
     */
    STATUS_PROTOCOL_ERROR: 7,

    /**
     * The status code used in callbacks when the player does not have
     * permissions to perform an operation.
     */
    STATUS_PERMISSION_DENIED: 8,

    /**
     * The status code used in [ConnectionListener.onConnectionFailed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionFailed} event
     * when the player has already a opened session on another device.
     */
    STATUS_ALREADY_CONNECTED: 9,

    /**
     * The status code used in [RoomListener]{@link
     * module:Scoreflex.Realtime.RoomListener} when the player attempts to
     * perform an operation while his session is not connected on the service.
     */
    STATUS_SESSION_NOT_CONNECTED: 10,

    /**
     * The status code used in [RoomListener]{@link
     * module:Scoreflex.Realtime.RoomListener} when the player attempts to
     * perform an operation on a room that he did not joined first.
     */
    STATUS_ROOM_NOT_JOINED: 11,

    /**
     * The status code used in [RoomListener.onRoomCreated]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomCreated} when the player
     * attempts to create a room with the same ID than an existing one.
     */
    STATUS_ROOM_ALREADY_CREATED: 12,

    /**
     * The status code used [RoomListener.onRoomClosed]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomClosed} when the the room is
     * closed normally by an external way.
     */
    STATUS_ROOM_CLOSED: 13,

    /**
     * The status code used [RoomListener.onRoomJoined]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomJoined} when the player
     * attempts to join a unknown room.
     */
    STATUS_ROOM_NOT_FOUND: 14,

    /**
     * The status code used in [RoomListener.onRoomJoined]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomJoined} when the player
     * attempts to join a room which the maximum number of participants allowed
     * was reached.
     */
    STATUS_ROOM_FULL: 15,

    /**
     * The status code used in [RoomListener.onRoomJoined]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomJoined} when the player
     * attempts to join awith a state that does not match its join strategy.
     */
    STATUS_STRATEGY_MISMATCH: 16,

    /**
     * The status code used in [RoomListener.onRoomCreated]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomCreated} when the player
     * uses an invalid configuration to create a room.
     */
    STATUS_INVALID_DATA: 17,

    /**
     * The status code used in [RoomListener.onMatchStateChanged]{@link
     * module:Scoreflex.Realtime.RoomListener.onMatchStateChanged} when the
     * player attempts to do an invalid change of the match's state.
     */
    STATUS_BAD_STATE: 18,

    /**
     * The status code used in [MessageSentListener.onFailure]{@link
     * module:Scoreflex.Realtime.MessageSentListener.onFailure} when the player
     * attempts to send a reliable message to a unknown participant.
     */
    STATUS_PEER_NOT_FOUND: 19,

    /**
     * The status code used in [RoomListener.onSetRoomPropertyFailed]{@link
     * module:Scoreflex.Realtime.RoomListener.onSetRoomPropertyFailed} when the
     * player attempts to change the room's property while it is forbidden.
     */
    STATUS_UPDATE_FORBIDDEN: 20
};

/**
 * Describes the connection's state of the realtime session.
 *
 * @readonly
 * @enum {integer}
 * @alias ConnectionState
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.ConnectionState = {
    /**
     * The connection is disconnected.
     */
    DISCONNECTED: 0,

    /**
     * The connection is connecting. The player should wait until the connection
     * is fully connected.
     */
    CONNECTING : 1,

    /**
     * The connection is connected. The player can try to create/join/leave
     * rooms and exchange data with room's participants.
     */
    CONNECTED : 2
};


/**
 * Describes the match's state in a room.
 * <br>
 * A room can be configured to start automatically a match when the minimum
 * number of participants required is reached. Else a match can be started
 * manually by calling [Session.startMatch]{@link
 * module:Scoreflex.Realtime.Session#startMatch}.
 * <br>
 * In a same way, a room can be configured to stop a match automatically when
 * the number of participants become lower than the minimum required. Else a
 * match can be stopped manually by calling [Session.stopMatch]{@link
 * module:Scoreflex.Realtime.Session#stopMatch}.
 * <br>
 * When a match is in the [FINISHED]{@link
 * module:Scoreflex.Realtime.MatchState.FINISHED} state, it should be reset
 * before starting a new match by calling [Session.resetMatch]{@link
 * module:Scoreflex.Realtime.Session#resetMatch}.
 *
 * @readonly
 * @enum {integer}
 * @alias MatchState
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.MatchState = {
    /**
     * The match is not started yet. The minimum number of participants required
     * to start a match is not reached yet.
     */
    PENDING: 1,

    /**
     * The match is ready to be started. The room was configured to not start
     * matches automatically. So to start a match, [Session.startMatch]{@link
     * module:Scoreflex.Realtime.Session#startMatch} should be called.
     */
    READY: 2,

    /**
     * The match is started. It will remain in this state until
     * [Session.stopMatch]{@link module:Scoreflex.Realtime.Session#stopMatch} is
     * called or the auto-stop condition is triggered.
     */
    RUNNING: 3,

    /**
     * The match is finished. To start a new match, [Session.resetMatch]{@link
     * module:Scoreflex.Realtime.Session#resetMatch} should be called.
     */
    FINISHED: 4
};


/*========================== Realtime objects ===========================*/
/**
 * The configuration used by players to create or join a room.
 *
 * @param {module:Scoreflex.Realtime.RoomListener} roomlistener The listener
 * used to notify the application of the room changes.
 * @param {module:Scoreflex.Realtime.MessageReceivedListener} messageListener
 * The listener used to notify the application of messages received from a
 * participant.
 *
 * @throws {module:Scoreflex.InvalidArgumentException} if one the listeners is
 * <code>undefined</code>
 *
 * @class RoomConfig
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.RoomConfig = function RealtimeRoomConfig(roomListener, messageListener) {

    if (roomListener == undefined)
        throw new Scoreflex.InvalidArgumentException('Room listener cannot be undefined');
    if (messageListener == undefined)
        throw new Scoreflex.InvalidArgumentException('Message listener cannot be undefined');

    this.roomListener    = roomListener;
    this.messageListener = messageListener;
    this.config          = {};

    /**
     * Sets the maximum number of participants allowed to join the room. This is
     * a required parameter.
     *
     * @param {integer} n the maximum number of participants.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setMaxParticipants
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setMaxParticipants = function(n) {
        this.config['maxPlayers'] = n;
        return this;
    };

    /**
     * Sets the minimum number of participants required to start a match. This
     * is an optional parameter. If not set, it is same than the maximum number
     * of participants allowed to join the room.
     *
     * @param {integer} n the minimum number of participants.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setMinParticipants
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setMinParticipants = function(n) {
        this.config['minPlayers'] = n;
        return this;
    };

    /**
     * Sets the room's tick-time, in milliseconds. This is an optional
     * parameter. If no tick-time is defined, every messages will be dispatched
     * by the sent as soon as possible.
     *
     * @param {integer} t The tick-time value.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setTickTime
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setTickTime = function(t) {
        this.config['tickTime'] = t;
        return this;
    };

    /**
     * Sets the auto-start flag for the room. This is an optional parameter.
     * <br>
     * This option is set to <code>false</code> by default.
     *
     * @param {boolean} b The auto-start flag value.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setAutoStart
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setAutoStart = function(b) {
        this.config['autoStart'] = b;
        return this;
    };

    /**
     * Sets the auto-stop flag for the room. This is an optional parameter.
     * <br>
     * This option is set to <code>false</code> by default.
     *
     * @param {boolean} b The auto-stop flag value.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setAutoStop
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setAutoStop = function(b) {
        this.config['autoStop'] = b;
        return this;
    };

    /**
     * Sets the join-strategy value for the room. This is an optional parameter.
     * <br>
     * This option is unset by default.
     *
     * @param {boolean} s The strategy value. It can be
     * <code>beforeFirstStart</code>, <code>beforeStart</code> or
     * <code>anymore</code>.
     *
     * @return {module:Scoreflex.Realtime.RoomConfig} The current configuration
     * object.
     *
     * @method setJoinStrategy
     * @memberof module:Scoreflex.Realtime.RoomConfig
     * @instance
     * @public
     */
    this.setJoinStrategy = function(s) {
        this.config['joinStratey'] = s;
        return this;
    };
};

/**
 * A realtime room with its configuration, properties and participants. Such
 * rooms can be created by calling [Session.createRoom]{@link
 * module:Scoreflex.Realtime.Session#createRoom}.
 *
 * @param {string} id The room's ID.
 * @param {module:Scoreflex.Realtime.MatchState} matchState The match's state of
 * the room.
 * @param {module:Scoreflex.Realtime.Map} config The room's configuration.
 * @param {module:Scoreflex.Realtime.Map} properties The room's properties.
 * @param {string[]} participants The room's participants.
 *
 * @class Room
 * @memberof module:Scoreflex.Realtime
 * @protected
 */
Scoreflex.Realtime.Room = function RealtimeRoom(id, matchState, config, properties, participants) {
    var roomId       = id;
    var matchState   = matchState;
    var config       = config;
    var properties   = properties;
    var participants = participants;

    var getId = function() {
        return roomId;
    };

    var getConfig = function() {
        return new Scoreflex.Realtime.UnmodifiableMap(config);
    };

    var getConfigValue = function(key) {
        return config.get(key);
    };

    var getProperties = function() {
        return new Scoreflex.Realtime.UnmodifiableMap(properties);
    };

    var getProperty = function(key) {
        return properties.get(key);
    };

    var getParticipants = function() {
        return participants;
    };

    var getMatchState = function() {
        return matchState;
    };

    var addParticipant = function(peerId) {
        if (participants.indexOf(peerId) == -1) {
            participants.push(peerId);
        }
    };

    var removeParticipant = function(peerId) {
        var idx = participants.indexOf(peerId);
        if (idx != -1) {
            participants.splice(idx, 1);
        }
    };

    var addProperty = function(key, value, type) {
        return properties.putTypedValue(key, value, type);
    };

    var removeProperty = function(key) {
        return properties.remove(key);
    };

    var setMatchState = function(state) {
        var oldState = matchState;
        matchState = state;
        return oldState;
    };

    /**
     * Retrieves the room's ID.
     *
     * @return {string} The room's ID.
     *
     * @method getId
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getId = getId;

    /**
     * Retrieves the room's configuration.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableMap} The room's
     * configuration.
     *
     * @method getConfig
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getConfig = getConfig;

    /**
     * Retrieves a specific parameter's value in the room's configuration, given
     * its key.
     *
     * @param {string} key The parameter's key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The parameter's value or
     * <code>undefined</code> if the parameter does not exists.
     *
     * @method getConfigValue
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getConfigValue = getConfigValue;

    /**
     * Retrieves the room's properties.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableMap} The room's
     * properties.
     *
     * @method getProperties
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getProperties = getProperties;

    /**
     * Retrieves a specific room's property, given its key.
     *
     * @param {string} The property's key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The property's value or
     * <code>undefined</code> if the property does not exists.
     *
     * @method getProperty
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getProperty = getProperty;

    /**
     * Retrieves the room's participants.
     *
     * @return {string[]} The room's participants.
     *
     * @method getParticipants
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getParticipants = getParticipants;

    /**
     * Retrieves the match's state of the room.
     *
     * @return {module:Scoreflex.Return.MatchState} The match's state.
     *
     * @method getMatchState
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @public
     */
    this.getMatchState = getMatchState;

    /**
     * @method addParticipant
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @private
     */
    this.addParticipant = addParticipant;

    /**
     * @method removeParticipant
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @private
     */
    this.removeParticipant = removeParticipant;

    /**
     * @method addProperty
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @private
     */
    this.addProperty = addProperty;

    /**
     * @method removeProperty
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @private
     */
    this.removeProperty = removeProperty;

    /**
     * @method setMatchState
     * @memberof module:Scoreflex.Realtime.Room
     * @instance
     * @private
     */
    this.setMatchState = setMatchState;
};

/**
 * A wrapper on the specified [realtime room]{@link
 * module:Scoreflex.Realtime.Room} which throws
 * [UnsupportedOperationException]{@link
 * module:Scoreflex.UnsupportedOperationException} whenever an attempt is made
 * to modify it.
 *
 * @param {module:Scoreflex.Realtime.Room} room the wrapped room.
 *
 * @throw {module:Scoreflex.NullReferenceException} if the room is
 * <code>undefined</code>.
 *
 * @class UnmodifiableRoom
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.UnmodifiableRoom = function UnmodifiableRoom(room) {
    if (room == undefined) {
        throw new Scoreflex.NullReferenceException();
    }

    /**
     * Call [Room.getId]{@link module:Scoreflex.Realtime.Room#getId} on the
     * wrapped room.
     *
     * @return {string} The room's ID.
     *
     * @method getId
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getId = function() {
        return room.getId();
    };

    /**
     * Call [Room.getConfig]{@link module:Scoreflex.Realtime.Room#getConfig} on
     * the wrapped room.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableMap} The room's
     * configuration.
     *
     * @method getConfig
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getConfig = function() {
        return room.getConfig();
    };

    /**
     * Call [Room.getConfigValue]{@link
     * module:Scoreflex.Realtime.Room#getConfigValue} on the wrapped room.
     *
     * @param {string} key The parameter's key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The parameter's value or
     * <code>undefined</code> if the parameter does not exists.
     *
     * @method getConfigValue
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getConfigValue = function(key) {
        return room.getConfigValue(key);
    };

    /**
     * Call [Room.getProperties]{@link
     * module:Scoreflex.Realtime.Room#getProperties} on the wrapped room.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableMap} The room's
     * properties.
     *
     * @method getProperties
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getProperties = function() {
        return room.getProperties();
    };

    /**
     * Call [Room.getProperty]{@link module:Scoreflex.Realtime.Room#getProperty}
     * on the wrapped room.
     *
     * @param {string} The property's key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The property's value or
     * <code>undefined</code> if the property does not exists.
     *
     * @method getProperty
     @instance @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getProperty = function(key) {
        return room.getProperty(key);
    };

    /**
     * Call [Room.getParticipants]{@link
     * module:Scoreflex.Realtime.Room#getParticipants} on the wrapped room.
     *
     * @return {string[]} The room's participants.
     *
     * @method getParticipants
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
    this.getParticipants = function() {
        return room.getParticipants();
    };

    /**
     * Call [Room.getMatchState]{@link
     * module:Scoreflex.Realtime.Room#getMatchState} on the wrapped room.
     *
     * @return {module:Scoreflex.Return.MatchState} The match's state.
     *
     * @method getMatchState
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @public
     */
   this.getMatchState = function() {
        return room.getMatchState();
    };

    /**
     * @method addParticipant
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @private
     */
    this.addParticipant = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * @method removeParticipant
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @private
     */
    this.removeParticipant = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * @method addProperty
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @private
     */
    this.addProperty = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * @method removeProperty
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @private
     */
    this.removeProperty = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * @method setMatchState
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableRoom
     * @private
     */
    this.setMatchState = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };
};
Scoreflex.Realtime.UnmodifiableRoom.prototype = new Scoreflex.Realtime.Room();
Scoreflex.Realtime.UnmodifiableRoom.prototype.constructor = Scoreflex.Realtime.UnmodifiableRoom;

/**
 * Acceptable types for the [Map]{@link module:Scoreflex.Realtime.Map} values.
 *
 * @typedef
 * {(null|number|dcodeIO.Long|boolean|string|dcodeIO.ByteBuffer|Int8Array|Int16Array|Int32Array)}
 * MapValue
 * @memberof module:Scoreflex.Realtime
 *
 */


/**
 * A <code>Map</code> is a structure consisting of a set of keys and values in
 * which each key is mapped to a single value. The keys are <code>string</code>
 * whereas the values can be:
 * <ul>
 *   <li><code>null</code></li>
 *   <li><code>number</code>
 *   <li><code>dcodeIO.Long</code></li>
 *   <li><code>boolean</code>
 *   <li><code>string</code>
 *   <li><code>dcodeIO.ByteBuffer</code>, <code>Int8Array</code>,
 *   <code>Int16Array</code> or <code>Int32Array</code></li>
 * </ul>
 *
 * A <code>Map</code> provides helper methods to iterate through all of the keys
 * contained in it, as well as various methods to access and update the
 * key/value pairs.
 * <br>
 * It also provides a method to know the number of bytes required to encode the
 * data.
 *
 * @param {Object.<string, module:Scoreflex.Realtime.MapValue>} obj An object
 * used to initialized the map.
 *
 * @class Map
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.Map = function RealtimeMap(obj) {
    var map            = {};
    var serializedSize = 0;


    var put = function(key, value) {
        return putTypedValue(key, value, valueType(value));
    };

    var putTypedValue = function(key, value, type) {
        var oldValue = remove(key);
        serializedSize += calculateSerializedSize(key, value, type);
        map[key] = {t: type, v: value};
        return oldValue;
    };

    var remove = function(key) {
        var oldValue = map[key];
        if (oldValue !== undefined) {
            serializedSize -= calculateSerializedSize(key, oldValue.v, oldValue.t);
            delete map[key];
            return oldValue.v;
        }
        return undefined;
    };

    var get = function(key) {
        var value = map[key];
        return ((value !== undefined) ? value.v: undefined);
    };

    var clear = function() {
        map = {};
        serializedSize = 0;
    };

    var size = function() {
        return Object.keys(map).length;
    };

    var isEmpty = function() {
        return !size();
    };

    var forEach = function(fun, thisArg) {
        if (typeof fun != 'function') {
            throw new TypeError();
        }
        for(var key in map) {
            var value  = map[key];
            fun.call(thisArg, key, value.v, value.t, this);
        };
    };

    var valueType = function(value) {
        if (value === null) {
            return 'VOID';
        }
        if (typeof(value) == 'number' || value instanceof Number) {
            if (isNaN(value) || value == Infinity || value == -Infinity || (value % 1) != 0) {
                return 'DOUBLE';
            }
            else if (value < 0 && value >= -0x80000000) {
                return 'SINT32';
            }
            else if (value < 0) {
                return 'SINT64';
            }
            else if (value <= 0x7fffffff) {
                return 'INT32';
            }
            else if (value <= 0xffffffff) {
                return 'UINT32';
            }
            else {
                return 'INT64';
            }
        }
        else if (typeof(value) == 'boolean' || value instanceof Boolean) {
            return 'BOOL';
        }
        else if (typeof(value) == 'string' || value instanceof String) {
            return 'STRING';
        }
        else if (value instanceof dcodeIO.Long) {
            if (value.isNegative()) {
                return 'SINT64';
            }
            else if (value.lessThanOrEqual(new dcodeIO.Long(0xFFFFFFFF, 0x7FFFFFFF))) {
                return 'INT64';
            }
            else {
                return 'UINT64';
            }
        }
        else if (value instanceof dcodeIO.ByteBuffer || value instanceof Int8Array ||
                 value instanceof Int16Array || value instanceof Int32Array) {
            return 'BYTES';
        }

        throw new TypeError();
    }

    var calculateSerializedSize = function(key, value, type) {
        var sz = key.length + ((key.length < 128) ? 1: 2);

        switch (type) {
          case 'SINT32':
          case 'INT32':
          case 'UINT32':
            return (sz + dcodeIO.ByteBuffer.calculateVarint32(value));

          case 'SINT64':
          case 'INT64':
          case 'UINT64':
            return (sz + dcodeIO.ByteBuffer.calculateVarint64(value));

          case 'DOUBLE':
            return (sz + 8);

          case 'BOOL':
            return (sz + 1);

          case 'STRING':
            var len = value.length;
            return (sz + len + (len<128 ? 1 : 2));

          case 'BYTES':
            var len = value.byteLength;
            return (sz + len + (len<128 ? 1 : 2));

          default: /* VOID */
            return sz;
        }
    };

    for (var key in obj) {
        var value = obj[key];
        var type  = valueType(value);
        serializedSize += calculateSerializedSize(key, value, type);
        map[key] = {t: type, v: value};
    };

    /**
     * Maps the specified key to the specified value. Valid types for the value
     * object are:
     * <ul>
     *   <li><code>null</code></li>
     *   <li><code>number</code> or <code>Number</code></li>
     *   <li><code>dcodeIO.Long</code></li>
     *   <li><code>boolean</code> or <code>Boolean</code></li>
     *   <li><code>string</code> or <code>String</code></li>
     *   <li><code>dcodeIO.ByteBuffer</code>, <code>Int8Array</code>,
     *   <code>Int16Array</code> or <code>Int32Array</code></li>
     * </ul>
     *
     * @param {string} key The key.
     * @param {module:Scoreflex.Realtime.MapValue} value The value.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The value of any previous
     * mapping with the specified key or <code>undefined</code> if there was no
     * mapping.
     *
     * @throws {TypeError} if the value's type is inappropriate for this map.
     *
     * @method put
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.put = put;

    /**
     * Removes a mapping with the specified key from this map.
     *
     * @param {string} key The of the mapping to remove.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The value of any previous
     * mapping with the specified key or <code>undefined</code> if there was no
     * mapping.
     *
     * @method remove
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.remove = remove;

    /**
     * Returns the value of the mapping with the specified key.
     *
     * @param {string} key The key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The value of the mapping
     * with the specified key, or <code>undefined</code> if no mapping for the
     * specified key is found.
     *
     * @method get
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.get = get;

    /**
     * Removes all elements from this map, leaving it empty.
     *
     * @method clear
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.clear = clear;

    /**
     * Returns the number of mappings in this map.
     *
     * @return {integer} The number of mappings in this map.
     *
     * @method size
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.size = size;

    /**
     * Return whether this map is empty.
     *
     * @return {boolean} <code>true</code> if the map is empty,
     * <code>false</code> otherwise.
     *
     * @method isEmpty
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.isEmpty = isEmpty;

    /**
     * Executes a provided function once per map element. <code>callback</code>
     * is invoked with four arguments:
     * <ul>
     *   <li>the element key</li>
     *   <li>the element value (can be <code>null</code>)</li>
     *   <li>the element type (as a <code>string</code>)</li>
     *   <li>the map being traversed</li>
     * </ul>
     * <br>
     * If a <code>thisArg</code> parameter is provided to <code>forEach</code>,
     * it will be passed to <code>callback</code> when invoked, for use as its
     * <code>this</code> value.  Otherwise, the value <code>undefined</code>
     * will be passed for use as its <code>this</code> value.
     *
     * @param {function} callback Function to execute for each element.
     * @param {Object} [thisArg] Value to use as this when executing callback.
     *
     * @method forEach
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.forEach = forEach;

    /**
     * Get the number of bytes required to encode this map.
     *
     * @return {integer} The number of bytes.
     *
     * @method serializedSize
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @public
     */
    this.serializedSize = function() { return serializedSize; };

    /**
     * @method putTypedValue
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @private
     */
    this.putTypedValue = putTypedValue;

    /**
     * @method valueType
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @private
     */
    this.valueType = valueType;

    /**
     * @method calculateSerializedSize
     * @instance
     * @memberof module:Scoreflex.Realtime.Map
     * @private
     */
    this.calculateSerializedSize = calculateSerializedSize;
};


/**
 * A wrapper on the specified [realtime map]{@link
 * module:Scoreflex.Realtime.Map} which throws
 * [UnsupportedOperationException]{@link
 * module:Scoreflex.UnsupportedOperationException} whenever an attempt is made
 * to modify it.
 *
 * @param {module:Scoreflex.Realtime.Map} map the wrapped map.
 *
 * @throw {module:Scoreflex.NullReferenceException} if the map is
 * <code>undefined</code>.
 *
 * @class UnmodifiableMap
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.UnmodifiableMap = function UnmodifiableMap(map) {
    if (map == undefined) {
        throw new Scoreflex.NullReferenceException();
    }

    /**
     * Throws [UnsupportedOperationException]{@link
     * module:Scoreflex.UnsupportedOperationException}.
     *
     * @method put
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.put = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * @method putTypedValue
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @private
     */
    this.putTypedValue = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * Throws [UnsupportedOperationException]{@link
     * module:Scoreflex.UnsupportedOperationException}.
     *
     * @method remove
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.remove = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * Throws [UnsupportedOperationException]{@link
     * module:Scoreflex.UnsupportedOperationException}.
     *
     * @method clear
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.clear = function() {
        throw new Scoreflex.UnsupportedOperationException();
    };

    /**
     * Call [Map.get]{@link module:Scoreflex.Realtime.Map#get} on the wrapped
     * map.
     *
     * @param {string} key The key.
     *
     * @return {module:Scoreflex.Realtime.MapValue} The value of the mapping
     * with the specified key, or <code>undefined</code> if no mapping for the
     * specified key is found.
     *
     * @method get
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.get = function(key) {
        return map.get(key);
    };

    /**
     * Call [Map.size]{@link module:Scoreflex.Realtime.Map#size} on the wrapped
     * map.
     *
     * @return {integer} The number of mappings in this map.
     *
     * @method size
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.size = function() {
        return map.size();
    };

    /**
     * Call [Map.isEmpty]{@link module:Scoreflex.Realtime.Map#isEmpty} on the
     * wrapped map.
     *
     * @return {boolean} <code>true</code> if the map is empty,
     * <code>false</code> otherwise.
     *
     * @method isEmpty
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.isEmpty = function() {
        return map.isEmpty();
    };

    /**
     * Call [Map.forEach]{@link module:Scoreflex.Realtime.Map#forEach} on the
     * wrapped map.
     *
     * @param {function} callback Function to execute for each element.
     * @param {Object} [thisArg] Value to use as this when executing callback.
     *
     * @method forEach
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.forEach = function(callback, thisArg) {
        return map.forEach(callback, thisArg);
    };

    /**
     * Call [Map.serializedSize]{@link
     * module:Scoreflex.Realtime.Map#serializedSize} on the wrapped map.
     *
     * @return {integer} The number of bytes.
     *
     * @method serializedSize
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @public
     */
    this.serializedSize = function() {
        return map.serializedSize();
    };

    /**
     * @method valueType
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @private
     */
    this.valueType = function(value) {
        return map.valueType(value);
    };

    /**
     * @method calculateSerializedSize
     * @instance
     * @memberof module:Scoreflex.Realtime.UnmodifiableMap
     * @private
     */
    this.calculateSerializedSize = function(key, value, type) {
        return map.calculateSerializedSize(key, value, type);
    };
};
Scoreflex.Realtime.UnmodifiableMap.prototype = new Scoreflex.Realtime.Map();
Scoreflex.Realtime.UnmodifiableMap.prototype.constructor = Scoreflex.Realtime.UnmodifiableMap;

/**
 * Create an object to manipulate a realtime session.
 *
 * @param {module:Scoreflex.SDK} scoreflexSDK
 * @param {string} clientId
 * @param {string} playerId
 * @param {string} accessToken
 *
 * @class Session
 * @memberof module:Scoreflex.Realtime
 * @protected
 */
Scoreflex.Realtime.Session = function RealtimeSession(scoreflexSDK, clientId, playerId, accessToken) {
    /**
     * Enum for the realtime session's state.
     *
     * @readonly
     * @enum {number}
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var State = {
        UNINITIALIZED: 0,
        INITIALIZING : 1,
        INITIALIZED  : 2
    };

    /**
     * The maximum serialized size allowed for a payload in the unreliable
     * messages
     *
     * @readonly
     * @constant {integer} MAX_UNRELIABLE_PAYLOAD_SIZE
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    /**
     * The maximum serialized size allowed for a payload in the reliable
     * messages.
     *
     * @constant {integer} MAX_RELIABLE_PAYLOAD_SIZE
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    /**
     * The maximum serliazed size allowed for the room's property list.
     *
     * @constant {integer} MAX_ROOM_PROPERTIES_SIZE
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    if (Scoreflex.Realtime.Session.__defineGetter__ && Scoreflex.Realtime.Session.__defineSetter__) {
        Scoreflex.Realtime.Session.__defineGetter__('MAX_UNRELIABLE_PAYLOAD_SIZE', function() { return 1300; });
        Scoreflex.Realtime.Session.__defineSetter__('MAX_UNRELIABLE_PAYLOAD_SIZE', function() {});
        Scoreflex.Realtime.Session.__defineGetter__('MAX_RELIABLE_PAYLOAD_SIZE',   function() { return 2048; });
        Scoreflex.Realtime.Session.__defineSetter__('MAX_RELIABLE_PAYLOAD_SIZE',   function() {});
        Scoreflex.Realtime.Session.__defineGetter__('MAX_ROOM_PROPERTIES_SIZE',    function() { return 1500; });
        Scoreflex.Realtime.Session.__defineSetter__('MAX_ROOM_PROPERTIES_SIZE',    function() {});
    }
    else {
        Scoreflex.Realtime.Session.MAX_UNRELIABLE_PAYLOAD_SIZE = 1300;
        Scoreflex.Realtime.Session.MAX_RELIABLE_PAYLOAD_SIZE   = 2048;
        Scoreflex.Realtime.Session.MAX_ROOM_PROPERTIES_SIZE    = 1500;
    }


    /* Retrieves the path of this script */
    var realtimeScriptPath = (function() {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; ++i) {
            var src;
            if (scripts[i].getAttribute.length !== undefined) {
                src = scripts[i].getAttribute('src');
            }
            else {
                src = scripts[i].getAttribute('src', 2);
            }
            var matches = src.match(/^(.*)scoreflexRealtime.js$/);
            if (matches) {
                return matches[1];
            }
        }
        return '/';
    })();

    /* Get the realtime protocol builder */
    var RealtimeProto = dcodeIO.ProtoBuf
        .protoFromFile(realtimeScriptPath+'protobuf/realtime.proto')
        .build('realtime.proto');

    /* Get the websocket object */
    var WS = false;
    if (window.WebSocket)
        WS = WebSocket;
    if (!WS && window.MozWebSocket)
        WS = MozWebSocket;
    if (!WS) {
        alert();
        throw new Error('WebSocket not supported by this browser');
    }

    /* aliases */
    var StatusCode      = Scoreflex.Realtime.StatusCode;
    var ConnectionState = Scoreflex.Realtime.ConnectionState;
    var MatchState      = Scoreflex.Realtime.MatchState;
    var InMessage       = RealtimeProto.InMessage;
    var OutMessage      = RealtimeProto.OutMessage;

    /* The realtime session's state */
    var SessionState = {};

    SessionState.sessionListener     = null;
    SessionState.state               = State.UNINITIALIZED;
    SessionState.host                = null;
    SessionState.port                = -1;
    SessionState.uri                 = null;
    SessionState.ws                  = null;
    SessionState.reconnectFlag       = true;
    SessionState.reconnectTout       = 1000;
    SessionState.maxReties           = 3;
    SessionState.connectionStatus    = ConnectionState.DISCONNECTED;
    SessionState.retries             = 0;
    SessionState.sessionId           = null;
    SessionState.sessionInfo         = null;
    SessionState.currentRoom         = null;
    SessionState.lastMsgid           = 0;
    SessionState.lastAckid           = 0;
    SessionState.lastRealiableId     = 0;
    SessionState.lastUnreliableIds   = {};
    SessionState.mmTime              = 0;
    SessionState.mmLatency           = 0;
    SessionState.mmClockLastUpdate   = 0;
    SessionState.inmsgQueue          = {};
    SessionState.outmsgQueue         = {};
    SessionState.roomListeners       = {};
    SessionState.rcvMessageListeners = {};
    SessionState.sndMessageListeners = {};


    //-- Session API
    /**
     * Checks if the realtime session is successfully initialized.
     *
     * @return {boolean} <code>true</code> if the realtime session is
     * initialized, <code>false</code> otherwise.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var isInitialized = function() {
        return (SessionState.state === State.INITIALIZED);
    };

    /**
     * Checks if the current session instance is initialized.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if the current playe has changed.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var checkInstance = function () {
        if (!isInitialized()) {
            throw new Scoreflex.InvalidStateException('Realtime session not initialized yet');
        }
        if (scoreflexSDK.Players.getCurrent().getId() !== playerId) {
            throw new Scoreflex.InvalidStateException('Current player has changed. Re-initialize realtime session');
        }
    };

    /**
     * Initializes the realtime session. This method should be called only
     * once. The Scoreflex SDK should be initialized first.
     *
     * @param {module:Scoreflex.Realtime.SessionInitializedListener} listener
     * The listener used to handle the initialization result.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the Scoreflex SDK is
     * not initialized or if the realtime session was already initialized.
     * @throws {module:Scoreflex.InvalidArgumentException} if the listener is
     * <code>undefined</code>
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var initialize = function(listener) {
        if (!scoreflexSDK.getSessionState() ==  Scoreflex.SessionState.INIT_SUCCESS)
            throw new Scoreflex.InvalidStateException('Scoreflex SDK is not initialized');
        if (SessionState.state === State.INITIALIZED)
            throw new Scoreflex.InvalidStateException('Realtime session already initialized');
        if (SessionState.state === State.INITIALIZING)
            throw new Scoreflex.InvalidStateException('Realtime session initialization already started');
        if (listener == undefined)
            throw new Scoreflex.InvalidArgumentException('Session listener cannot be undefined');

        SessionState.state           = State.INITIALIZING;
        SessionState.sessionListener = listener;

        var onLoad = function() {
            if (this.responseJSON && this.responseJSON.servers && this.responseJSON.servers.ws) {
                var wsServer = this.responseJSON.servers.ws[0];
                SessionState.host  = wsServer.host;
                SessionState.port  = wsServer.port;
                SessionState.uri   = wsServer.path;
                SessionState.state = State.INITIALIZED;
                if (SessionState.sessionListener.onInitialized)
                    SessionState.sessionListener.onInitialized();
            }
            else if (SessionState.sessionListener.onInitializationFailed) {
                SessionState.sessionListener.onInitializationFailed(StatusCode.STATUS_INTERNAL_ERROR);
            }
        };
        var onError = function() {
            SessionState.state = State.UNINITIALIZED;
            var status = StatusCode.STATUS_INTERNAL_ERROR;
            if (this.status == 403) {
                status = StatusCode.STATUS_PERMISSION_DENIED;
            }
            else if (this.responseText === null) {
                status = StatusCode.STATUS__NETWORK_ERROR;
            }
            if (SessionState.sessionListener.onInitializationFailed)
                SessionState.sessionListener.onInitializationFailed(status);
        };

        scoreflexSDK.RestClient.get('/realtime/serviceInfo', {}, {onload: onLoad, onerror: onError});
    };

    /**
     * Deinitialize the realtime session.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var deinitialize = function() {
        if (isInitialized()) {
            if (isConnected()) {
                disconnect();
            }
            SessionState.state = State.UNINITIALIZED;
            scoreflexSDK.destroyRealtimeSession();
            if (SessionState.sessionListener.onDeInitialized) {
                SessionState.sessionListener.onDeInitialized();
            }
            SessionState.sessionListener = {};
        }
    };

    /**
     * Retrieves the server address currently used to connect.
     *
     * @return {string} The server address  currently used.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getServerAddr = function() {
        checkInstance();
        return 'ws://'+SessionState.host+':'+SessionState.port+SessionState.uri;
    };

    /**
     * Sets the value of the reconnect flag. By setting it to <code>true</code>,
     * the session will be automatically reconnected when an error occurs. The
     * reconnect attempts will be made with a configurable delay. After a number
     * of consecutive reconnection failures, an error is notified.
     * <br><br>
     * Default value: <code>true</code>.
     *
     * @param {boolean} flag <code>true</code> to enable the automatic
     * reconnection, <code>false</code> otherwise.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var setReconnectFlag = function(flag) {
        checkInstance();
        SessionState.reconnectFlag = flag;
    };

    /**
     * Retrieves value of the reconnect flag.
     *
     * @return {boolean} <code>true</code> if the automatic reconnection is
     * enabled, <code>false</code> otherwise.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getReconnectFlag = function() {
        checkInstance();
        return SessionState.reconnectFlag;
    };

    /**
     * Sets the delay, in milliseconds, before an automatic reconnect attempt.
     * <br><br>
     * Default value: 1000ms.
     *
     * @param {integer} timeout The milliseconds to wait before an automatic
     * reconnection.
     *
     * @throws {IllegalStateException} if the realtime session is not
     * initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var setReconnectTimeout = function(timeout) {
        checkInstance();
        SessionState.reconnectTout = timeout;
    }

    /**
     * Retrieves the delay used before an automatic reconnect attempt.
     *
     * @return {integer} The delay, in milliseconds, before an automatic
     * reconnect attempt.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getReconnectTimeout = function() {
        checkInstance();
        return SessionState.reconnectTout;
    };

    /**
     * Sets the maximum number of consecutive reconnection failures allowed
     * before notifying an error.
     * <br><br>
     * Default value: 3.
     *
     * @param {integer} n The maximum number of consecutive reconnection
     * failures.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var setMaxRetries = function(n) {
        checkInstance();
        SessionState.maxReties = n;
    };

    /**
     * Retrieves the maximum of consecutive reconnection failures.
     *
     * @return {integer} The maximum number of consecutive reconnection
     * failures.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getMaxRetries = function() {
        checkInstance();
        return SessionState.maxReties;
    };

    /**
     * Retrieves the connection state of the realtime session.
     *
     * @return {module:Scoreflex.Realtime.ConnectionState} The state of the
     * realtime connection.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getConnectionState = function() {
        return SessionState.connectionStatus;
    };

    /**
     * Checks if the connection is connected.
     *
     * @return {boolean} <code>true</code> is the connection's state is
     * [CONNECTED]{@link module:Scoreflex.Realtime.ConnectionState.CONNECTED},
     * <code>false</code> otherwise.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var isConnected = function() {
        return (SessionState.connectionStatus == ConnectionState.CONNECTED);
    };

    /**
     * Retrieves information associated to the realtime session.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableMap} The session's
     * information. If the session is not connected, this method returns
     * <code>null</code>.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getSessionInfo = function() {
        checkInstance();
        return new Scoreflex.Realtime.UnmodifiableMap(SessionState.sessionInfo);
    };

    /**
     * Retrieves the room which the player joined.
     *
     * @return {module:Scoreflex.Realtime.UnmodifiableRoom} The current player's
     * room. if the player has not joined any rooms, this method returns
     * <code>null</code>.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var getCurrentRoom = function() {
        checkInstance();
        return new Scoreflex.Realtime.UnmodifiableRoom(SessionState.currentRoom);
    };

    /**
     * Connects the realtime session to the Scoreflex realtime service.
     * <br>
     * This method will return immediatly, and will call
     * [ConnectionListener.onConnected]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnected} or
     * [ConnectionListener.onConnectionFailed]{@link
     * module:Scoreflex.Realtime.ConnectionListener.onConnectionFailed}
     * depending of the operation's result.
     *
     * @param {module:Scoreflex.Realtime.ConnectionListener} listener
     * Listener to use to notify the application of the connection's state
     * changes.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     * @throws {module:Scoreflex.InvalidArgumentException} if the listener is
     * <code>undefined</code>
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var connect = function(listener) {
        checkInstance();
        if (listener == undefined)
            throw new Scoreflex.InvalidArgumentException('Connection listener cannot be undefined');

        if (SessionState.retries >= SessionState.maxReties) {
            SessionState.retries = 0;
            if (listener.onConnectionFailed)
                listener.onConnectionFailed(StatusCode.STATUS_NETWORK_ERROR);
            return;
        }

        if (SessionState.ws != null && SessionState.ws.readyState == WS.OPEN) {
            SessionState.ws.close();
            SessionState.ws = null;
        }

        try {
            var onOpen = function() {
                if (this == SessionState.ws)
                    _onConnectionOpened(listener);
            };
            var onClose = function() {
                if (this == SessionState.ws)
                    _onConnectionClosed(listener);
            };
            var onMessage = function(m) {
                if (this == SessionState.ws)
                    _onMessageReceived(m.data, listener);
            };

            SessionState.ws = new WS(getServerAddr());
            SessionState.ws.onopen     = onOpen;
            SessionState.ws.onmessage  = onMessage;
            SessionState.ws.onclose    = onClose;
            SessionState.ws.binaryType = 'arraybuffer';
        }
        catch (exception) {
            console.log(exception);
            if (listener.onConnectionFailed)
                listener.onConnectionFailed(StatusCode.STATUS_NETWORK_ERROR);
        }
    };

    /**
     * Closes the connection to the Scoreflex realtime service. This methods
     * also destroys the player's session on the server.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var disconnect = function() {
        if (!isInitialized()) {
            throw new Scoreflex.InvalidStateException('Realtime session not initialized yet');
        }

        if (isConnected()) {
            var msg = new RealtimeProto.Disconnect();
            var inmsg = new InMessage();
            inmsg.setMsgid(0);
            inmsg.setAckid(0);
            inmsg.setIsReliable(true);
            inmsg.setType(InMessage.Type.DISCONNECT);
            inmsg.setDisconnect(msg);

            sendMessage(inmsg);
            SessionState.ws.close();
        }

        SessionState.connectionStatus    = ConnectionState.DISCONNECTED;
        SessionState.ws                  = null;
        SessionState.sessionId           = null;
        SessionState.sessionInfo         = null;
        SessionState.currentRoom         = null;
        SessionState.lastMsgid           = 0;
        SessionState.lastAckid           = 0;
        SessionState.lastRealiableId     = 0;
        SessionState.lastUnreliableIds   = {};
        SessionState.inmsgQueue          = {};
        SessionState.outmsgQueue         = {};
        SessionState.roomListeners       = {};
        SessionState.rcvMessageListeners = {};
        SessionState.sndMessageListeners = {};
    }

    /**
     * Creates a realtime room. The result of this operation will be notified by
     * the callback [RoomListener.onRoomCreated]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomCreated} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} in
     * [RoomConfig]{@link module:Scoreflex.Realtime.RoomConfig}.
     *
     * @param {string} id The room's ID.
     * @param {module:Scoreflex.Realtime.RoomConfig} roomConfig The room's
     * configuration.
     * @param {Object} [roomProps] The room's properties.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     * @throws {module:Scoreflex.InvalidArgumentException} if the room's id or
     * the room's configuration are <code>undefined</code>
     * @throws {module:Scoreflex.InvalidArgumentException} if the serialized
     * size of the room's property list exceeds MAX_ROOM_PROPERTIES_SIZE.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var createRoom = function(id, roomConfig, roomProps) {
        checkInstance();
        if (id == undefined)
            throw new Scoreflex.InvalidArgumentException('Room id cannot be undefined');
        if (roomConfig == undefined)
            throw new Scoreflex.InvalidArgumentException('Room id cannot be undefined');
        if (!(roomProps instanceof Scoreflex.Realtime.Map)) {
            roomProps = new Scoreflex.Realtime.Map(roomProps);
        }
        if (roomProps.serializedSize() > Scoreflex.Realtime.MAX_ROOM_PROPERTIES_SIZE)
            throw new Scoreflex.InvalidArgumentException(
                'Serialized size of the room properties exceeds MAX_ROOM_PROPERTIES_SIZE'
            );


        if (!isConnected()) {
            if (roomConfig.roomListener.onRoomCreated)
                roomConfig.roomListener.onRoomCreated(StatusCode.STATUS_SESSION_NOT_CONNECTED);
            return;
        }

        var msg = new RealtimeProto.CreateRoom(id,
                                               realtimeMapToProtoMap(roomConfig.config),
                                               realtimeMapToProtoMap(roomProps));

        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.CREATE_ROOM);
        inmsg.setCreateRoom(msg);

        if (!sendMessage(inmsg)) {
            if (roomConfig.roomListener.onRoomCreated)
                roomConfig.roomListener.onRoomCreated(StatusCode.STATUS_NETWORK_ERROR);
            return;
        }

        SessionState.roomListeners[id]       = roomConfig.roomListener;
        SessionState.rcvMessageListeners[id] = roomConfig.messageListener;

        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Joins a realtime room. The result of this operation will be notified by
     * the callback [RoomListener.onRoomJoined]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomJoined} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener}.
     *
     * @param {string} id The room's ID.
     * @param {module:Scoreflex.Realtime.RoomListener} roomListener The listener
     * used to notify the player of room's state changes.
     * @param {module:Scoreflex.Realtime.MessageReceivedListener}
     * Messagelistener The listener used to notify the player when a message is
     * received.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet.
     * @throws {module:Scoreflex.InvalidArgumentException} if the one of
     * listeners is <code>undefined</code> or if the room's id is
     * <code>undefined</code>.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var joinRoom = function(id, roomListener, messageListener) {
        if (id == undefined)
            throw new Scoreflex.InvalidArgumentException('Room id cannot be undefined');
        if (roomListener == undefined)
            throw new Scoreflex.InvalidArgumentException('Room listener cannot be undefined');
        if (messageListener == undefined)
            throw new Scoreflex.InvalidArgumentException('Message listener cannot be undefined');

        if (!isConnected()) {
            if (roomListener.onRoomJoined)
                roomListener.onRoomJoined(StatusCode.STATUS_SESSION_NOT_CONNECTED);
            return;
        }

        var msg = new RealtimeProto.JoinRoom(id);
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.JOIN_ROOM);
        inmsg.setJoinRoom(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onRoomJoined)
                roomListener.onRoomJoined(StatusCode.STATUS_NETWORK_ERROR);
            return;
        }

        SessionState.roomListeners[id]       = roomListener;
        SessionState.rcvMessageListeners[id] = messageListener;

        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Leaves the current room. The result of this operation will be notified by
     * the callback [RoomListener.onRoomLeft]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomLeft} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} set when the
     * player has created or joined the room.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var leaveRoom = function() {
        checkInstance();
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');

        var roomlistener = SessionState.roomListeners[SessionState.currentRoom.getId()];
        if (!isConnected()) {
            if (roomListener.onRoomLeft)
                roomListener.onRoomLeft(StatusCode.STATUS_SESSION_NOT_CONNECTED,
                                        SessionState.currentRoom.getId());
            return;
        }

        var msg = new RealtimeProto.LeaveRoom(SessionState.currentRoom.getId());
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.LEAVE_ROOM);
        inmsg.setLeaveRoom(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onRoomLeft)
                roomListener.onRoomLeft(StatusCode.STATUS_NETWORK_ERROR,
                                        SessionState.currentRoom.getId());
            return;
        }
        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Sets the match's state to [RUNNING]{@link
     * module:Scoreflex.Realtime.MatchState.RUNNING}. The result of this
     * operation will be notified by the callback
     * [RoomListener.onMatchStateChanged]{@link
     * module:Scoreflex.Realtime.RoomListener.onMatchStateChanged} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} set when the
     * player has created or joined the room.
     * <br>
     * The current match's state should be [READY]{@link
     * module:Scoreflex.Realtime.MatchState.READY} to have a chance to succeed.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var startMatch = function() {
        checkInstance();
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');

        var roomlistener = SessionState.roomListeners[SessionState.currentRoom.getId()];
        if (!isConnected()) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_SESSION_NOT_CONNECTED,
                                                 SessionState.currentRoom);
            return;
        }

        var msg = new RealtimeProto.StartMatch(SessionState.currentRoom.getId());
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.START_MATCH);
        inmsg.setStartMatch(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_NETWORK_ERROR,
                                                 SessionState.currentRoom);
            return;
        }
        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Sets the match's state to [FINISHED]{@link
     * module:Scoreflex.Realtime.MatchState.FINISHED}. The result of this
     * operation will be notified by the callback
     * [RoomListener.onMatchStateChanged]{@link
     * module:Scoreflex.Realtime.RoomListener.onMatchStateChanged} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} set when the
     * player has created or joined the room.
     * <br>
     * The current match's state should be [RUNNING]{@link
     * module:Scoreflex.Realtime.MatchState.RUNNING} to have a chance to succeed.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var stopMatch = function() {
        checkInstance();
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');

        var roomlistener = SessionState.roomListeners[SessionState.currentRoom.getId()];
        if (!isConnected()) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_SESSION_NOT_CONNECTED,
                                                 SessionState.currentRoom);
            return;
        }

        var msg = new RealtimeProto.StopMatch(SessionState.currentRoom.getId());
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.STOP_MATCH);
        inmsg.setStopMatch(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_NETWORK_ERROR,
                                                 SessionState.currentRoom);
            return;
        }
        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Sets the match's state to [PENDING]{@link
     * module:Scoreflex.Realtime.MatchState.PENDING}. The result of this
     * operation will be notified by the callback
     * [RoomListener.onMatchStateChanged]{@link
     * module:Scoreflex.Realtime.RoomListener.onMatchStateChanged} to the given
     * [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} set when the
     * player has created or joined the room.
     * <br>
     * The current match's state should be [FINISHED]{@link
     * module:Scoreflex.Realtime.MatchState.FINISHED} to have a chance to succeed.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var resetMatch = function() {
        checkInstance();
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');

        var roomlistener = SessionState.roomListeners[SessionState.currentRoom.getId()];
        if (!isConnected()) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_SESSION_NOT_CONNECTED,
                                                 SessionState.currentRoom);
            return;
        }

        var msg = new RealtimeProto.ResetMatch(SessionState.currentRoom.getId());
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.RESET_MATCH);
        inmsg.setResetMatch(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onMatchStateChanged)
                roomListener.onMatchStateChanged(StatusCode.STATUS_NETWORK_ERROR,
                                                 SessionState.currentRoom);
            return;
        }
        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Sets or Updates a room's property given its key. The result of this
     * operation will be notified by the callback
     * [RoomListener.onRoomPropertyChanged]{@link
     * module:Scoreflex.Realtime.RoomListener.onRoomPropertyChanged} to the
     * given [RoomListener]{@link module:Scoreflex.Realtime.RoomListener} set
     * when the player has created or joined the room.
     * <br>
     * If the value is <code>undefined</code>, the property will be removed.
     *
     * @param {string} key The property's key.
     * @param {module:Scoreflex.Realtime.MapValue} The property's value.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     * @throws {module:Scoreflex.InvalidArgumentException} if the property's key
     * is <code>undefined</code> or if the value's type is inappropriate.
     * @throws {module:Scoreflex.InvalidArgumentException} if the serialized
     * size of the updated room's properties exceeds MAX_ROOM_PROPERTIES_SIZE.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var setRoomProperty = function(key, value) {
        checkInstance();
        if (key == undefined)
            throw new Scoreflex.InvalidArgumentException('Property key cannot be null');
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');

        var roomlistener = SessionState.roomListeners[SessionState.currentRoom.getId()];
        if (!isConnected()) {
            if (roomListener.onSetRoomPropertyFailed)
                roomListener.onSetRoomPropertyFailed(StatusCode.STATUS_SESSION_NOT_CONNECTED,
                                                     SessionState.currentRoom, key);
            return;
        }

        var valueType = 'VOID';
        if (value !== undefined) {
            var props     = SessionState.currentRoom.getProperties();
            var propsSize = props.serializedSize();
            try {
                var oldValue  = props.get(key);
                if (oldValue !== undefined) {
                    propsSize -= props.calculateSerializedSize(key, oldValue, props.valueType(value));
                }
                valueType = props.valueType(value);
                propsSize += props.calculateSerializedSize(key, value, valueType);
            }
            catch (e) {
                throw new Scoreflex.InvalidArgumentException('Invalid value type');
            }
            if (propsSize > Scoreflex.Realtime.MAX_ROOM_PROPERTIES_SIZE)
                throw new Scoreflex.InvalidArgumentException(
                    'Serialized size of the room properties exceeds MAX_ROOM_PROPERTIES_SIZE'
                );
        }

        var msg = new RealtimeProto.SetRoomProperty(SessionState.currentRoom.getId(),
                                                    pairToMapEntry(key, value, valueType));
        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.SET_ROOM_PROPERTY);
        inmsg.setSetRoomProperty(msg);

        if (!sendMessage(inmsg)) {
            if (roomListener.onSetRoomPropertyFailed)
                roomListener.onSetRoomPropertyFailed(StatusCode.STATUS_NETWORK_ERROR,
                                                     SessionState.currentRoom, key);
            return;
        }
        SessionState.lastMsgid++;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
    };

    /**
     * Sends a unreliable message to a participant in the room. If
     * <code>peerId</code> is <code>null</code>, the message will be broadcasted
     * to all participants in the room. The maximum payload size supported, once
     * serialized, is MAX_UNRELIABLE_PAYLOAD_SIZE bytes.
     *
     * @param {string} peerId The participant's ID to send the message to.
     * @param {byte} tag The tag of the message.
     * @param {module:Scoreflex.Realtime.Map} payload The message's data to
     * sent.
     *
     * @return [STATUS_SUCCESS]{@link
     * module:Scoreflex.Realtime.StatusCode.STATUS_SUCCESS} on a successful
     * attempt, [STATUS_SESSION_NOT_CONNECTED]{@link
     * module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} if the
     * player's session is not connected on the service,
     * [STATUS_NETWORK_ERROR]{@link
     * module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} if a network
     * error occurs.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     * @throws {module:Scoreflex.InvalidArgumentException} if the
     * </code>peerId</code> is the current player.
     * @throws {module:Scoreflex.InvalidArgumentException} if the serialized
     * size of the payload exceeds MAX_UNRELIABLE_PAYLOAD_SIZE.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var sendUnreliableMessage = function(peerId, tag, payload) {
        checkInstance();
        if (peerId === playerId)
            throw new Scoreflex.InvalidArgumentException('Invalid peer id');
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');
        if (!(payload instanceof Scoreflex.Realtime.Map))
            payload = new Scoreflex.Realtime.Map(payload);
        if (payload.serializedSize() > Scoreflex.Realtime.MAX_UNRELIABLE_PAYLOAD_SIZE)
            throw new Scoreflex.InvalidArgumentException(
                'Serialized size of the payload exceeds MAX_UNRELIABLE_PAYLOAD_SIZE'
            );

        if (!isConnected()) {
            return StatusCode.STATUS_SESSION_NOT_CONNECTED;
        }

        var msgid = getMmTime();
        var msg = new RealtimeProto.RoomMessage();
        msg.setRoomId(SessionState.currentRoom.getId());
        msg.setTimestamp(msgid);
        msg.setTag(tag);
        msg.setIsReliable(false);
        msg.setPayload(realtimeMapToProtoMap(payload));
        msg.setToId(peerId);

        var inmsg = new InMessage();
        inmsg.setMsgid(msgid);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(false);
        inmsg.setType(InMessage.Type.ROOM_MESSAGE);
        inmsg.setRoomMessage(msg);

        if (!sendMessage(inmsg)) {
            return StatusCode.STATUS_NETWORK_ERROR;
        }
        return StatusCode.STATUS_SUCCESS;
    };

    /**
     * Sends a reliable message to a participant in the room. The caller will
     * receive a callback to report the status of the send message
     * operation. The maximum payload size supported, once serialized, is
     * MAX_RELIABLE_PAYLOAD_SIZE bytes.
     *
     * @param listener the [MessageSentListener]{@link
     * module:Scoreflex.Realtime.MessageSentListener} used to notify the player
     * of the operation's result.
     * @param {string} peerId The participant's ID to send the message to.
     * @param {byte} tag The tag of the message.
     * @param {module:Scoreflex.Realtime.Map} payload The message's data to
     * sent.
     *
     * @return The ID of the message sent, which will be returned in the
     * callbacks [MessageSentListener.onSuccess]{@link
     * module:Scoreflex.Realtime.MessageSentListener.onSuccess} or
     * [MessageSentListener.onFailure]{@link
     * module:Scoreflex.Realtime.MessageSentListener.onFailure}. If the player's
     * session is not connected on the service,
     * [STATUS_SESSION_NOT_CONNECTED]{@link
     * module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} is
     * returned, and if a network error occurs, [STATUS_NETWORK_ERROR]{@link
     * module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} is returned.
     *
     * @throws {module:Scoreflex.InvalidStateException} if the realtime session
     * is not initialized yet or if no room is joined.
     * @throws {module:Scoreflex.InvalidArgumentException} if the listener is
     * <code>undefined</code>.
     * @throws {module:Scoreflex.InvalidArgumentException} if the
     * </code>peerId</code> is <code>undefined</code> or is the current player.
     * @throws {module:Scoreflex.InvalidArgumentException} if the serialized
     * size of the payload exceeds MAX_RELIABLE_PAYLOAD_SIZE.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @public
     */
    var sendReliableMessage = function(listener, peerId, tag, payload) {
        checkInstance();
        if (listener == undefined)
            throw new Scoreflex.InvalidArgumentException("Message listener cannot be null");
        if (peerId == undefined || peerId === playerId)
            throw new Scoreflex.InvalidArgumentException('Invalid peer id');
        if (SessionState.currentRoom == null)
            throw new Scoreflex.InvalidStateException('No room is joined');
        if (!(payload instanceof Scoreflex.Realtime.Map))
            payload = new Scoreflex.Realtime.Map(payload);
        if (payload.serializedSize() > Scoreflex.Realtime.MAX_RELIABLE_PAYLOAD_SIZE)
            throw new Scoreflex.InvalidArgumentException(
                'Serialized size of the payload exceeds MAX_RELIABLE_PAYLOAD_SIZE'
            );

        if (!isConnected()) {
            return StatusCode.STATUS_SESSION_NOT_CONNECTED;
        }
        var msg = new RealtimeProto.RoomMessage();
        msg.setRoomId(SessionState.currentRoom.getId());
        msg.setTimestamp(getMmTime());
        msg.setTag(tag);
        msg.setIsReliable(true);
        msg.setPayload(realtimeMapToProtoMap(payload));
        msg.setToId(peerId);

        var inmsg = new InMessage();
        inmsg.setMsgid(SessionState.lastMsgid+1);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.ROOM_MESSAGE);
        inmsg.setRoomMessage(msg);

        if (!sendMessage(inmsg)) {
            return StatusCode.STATUS_NETWORK_ERROR;
        }
        SessionState.lastMsgid++;
        SessionState.sndMessageListeners[SessionState.lastMsgid] = listener;
        SessionState.inmsgQueue[SessionState.lastMsgid] = inmsg;
        return SessionState.lastMsgid;
    };


    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var reconnectSession = function(connectionListener) {
        var onReconnect = function() {
            if (SessionState.ws == null) {
                SessionState.retries++;
                connect(connectionListener);
            }
        };
        setTimeout(onReconnect, SessionState.reconnectTout);
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var sendMessage = function(msg) {
        if (SessionState.ws.readyState == SessionState.ws.OPEN) {
            SessionState.ws.send(msg.encode().toArrayBuffer());
            return true;
        }
        else {
            // FIXME: call connectionfailed ?
            console.log('Failed to send msg');
            return false;
        }
    };

    /**
     * Retrieves the monotonic time, in milliseconds, since the current page
     * started to load.
     *
     * @return {integer} The session's monotonic time.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var getMonotonicTime = function() {
        if (window.performance && window.performance.now) {
            return Math.floor(window.performance.now());
        }
        else if (window.performance && window.performance.webkitNow) {
            return Math.floor(window.performance.webkitNow());
        }
        else {
            return Date.now();
        }
    };

    /**
     * Retrieves the session's multimedia time.
     *
     * @return {integer} The session's multimedia time.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var getMmTime = function() {
        return (getMonotonicTime() - SessionState.mmClockLastUpdate + SessionState.mmTime);
    };

    /**
     * Callback called when the WebSocket connection is established.
     *
     * @param {module:Scoreflex.Realtime.ConnectionListener} connectionListener
     * Listener to use to notify the application of the connection's state
     * changes.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var _onConnectionOpened = function(connectionListener) {
        var msg = new RealtimeProto.Connect(playerId, clientId, accessToken);
        if (SessionState.sessionId) {
            msg.setSessionId(SessionState.sessionId);
        }
        var inmsg = new InMessage();
        inmsg.setMsgid(0);
        inmsg.setAckid(SessionState.lastRealiableId);
        inmsg.setIsReliable(true);
        inmsg.setType(InMessage.Type.CONNECT);
        inmsg.setConnect(msg);

        sendMessage(inmsg);
    };

    /**
     * Callback called when the WebSocket connection is closed.
     *
     * @param {module:Scoreflex.Realtime.ConnectionListener} connectionListener
     * Listener to use to notify the application of the connection's state
     * changes.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var _onConnectionClosed = function(connectionListener) {
        if (isConnected()) {
            SessionState.ws = null;
            if (SessionState.reconnectFlag) {
                console.log('WebSocket Connection closed unexpectedly, try reconnecting');
                if (connectionListener.onReconnecting)
                    connectionListener.onReconnecting(StatusCode.STATUS_NETWORK_ERROR);
                reconnectSession(connectionListener);
            }
            else {
                console.log('WebSocket Connection closed unexpectedly, return a network error');
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_NETWORK_ERROR);
            }
        }
    };

    /**
     * Callback called when a message is received on the WebSocket connection.
     *
     * @param {ArrayBuffer} data  Data received.
     * @param {module:Scoreflex.Realtime.ConnectionListener} connectionListener
     * Listener to use to notify the application of the connection's state
     * changes.
     *
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var _onMessageReceived = function(data, connectionListener) {
        if (scoreflexSDK.Players.getCurrent().getId() !== playerId) {
            console.log('Current player has changed. Disconnect the realtime session');
            deinitialize();
            return;
        }

        var msg = OutMessage.decode(data);

        ackReliableMessages(msg.getAckid());
        if (msg.getMsgid() == 0) {
            handleOutMessage(msg, connectionListener);
        }
        else if (!msg.getIsReliable()) {
            onUnreliableMessageReceived(msg, connectionListener);
        }
        else {
            onReliableMessageReceived(msg, connectionListener);
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var ackReliableMessages = function(ackid) {
        for (; SessionState.lastAckid <= ackid; SessionState.lastAckid++) {
            delete SessionState.inmsgQueue[SessionState.lastAckid];
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var onReliableMessageReceived = function(msg, connectionListener) {
        var msgid = msg.getMsgid();

        if (msgid > SessionState.lastRealiableId + 1) {
            console.log('Queue reliable message '+msgid);
            SessionState.outmsgQueue[msgid] = msg;
        }
        else if (msgid == SessionState.lastRealiableId + 1) {
            console.log('Handle reliable message '+msgid);
            SessionState.lastRealiableId = msgid;
            handleOutMessage(msg, connectionListener);
        }
        else {
            console.log('Skip reliable message '+msgid);
        }
        while (true) {
            var nextMsg = SessionState.outmsgQueue[SessionState.lastRealiableId+1];
            if (nextMsg == null)
                break;
            delete SessionState.outmsgQueue[SessionState.lastRealiableId+1];
            console.log('Handle reliable message '+nextMsg.getMsgid());
            SessionState.lastRealiableId = nextMsg.getMsgid();
            handleOutMessage(nextMsg);
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var onUnreliableMessageReceived = function(msg, connectionListener) {
        var idx;
        var msgid = msg.getMsgid();
        var type  = msg.getType();

        if (type == OutMessage.Type.ROOM_MESSAGE) {
            var room_msg = msg.getRoomMessage();
            idx = room_msg.getTag();
            if (idx == 0) {
                console.log('Handle unreliable message '+msgid+' (tag:0)');
                handleOutMessage(room_msg);
                return;
            }
        }
        else {
            idx = 256 + type;
        }
        var last_id = SessionState.lastUnreliableIds[idx];
        if (last_id == null || msgid > last_id) {
            console.log('Handle unreliable message '+msgid+' (tag:'+idx+')');
            SessionState.lastUnreliableIds[idx] = msgid;
            handleOutMessage(msg);
        }
        else {
            console.log('Skip unreliable message '+msgid+' (tag:'+idx+')');
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var handleOutMessage = function(msg, connectionListener) {
        switch (msg.type) {
        case OutMessage.Type.CONNECTED:
            console.log('CONNECTED message received');
            SessionState.connectionStatus  = ConnectionState.CONNECTED;
            SessionState.retries           = 0;
            SessionState.sessionId         = msg.getConnected().sessionId;
            SessionState.sessionInfo       = protoMapToRealtimeMap(msg.getConnected().info);
            SessionState.mmTime            = msg.getConnected().mmTime;
            SessionState.mmClockLastUpdate = getMonotonicTime();

            var keys = Object.keys(SessionState.inmsgQueue);
            keys.sort();

            if (connectionListener.onConnected)
                connectionListener.onConnected(SessionState.sessionInfo);

            for (var i = 0; i < keys.length; ++i) {
                var inmsg = SessionState.inmsgQueue[i];
                console.log('Resend reliable message '+inmsg.getMsgid());
                inmsg.setAckid(SessionState.lastRealiableId);
                sendMessage(inmsg);
            }
            break;

          case OutMessage.Type.CONNECTION_FAILED:
            console.log('CONNECTION_FAILED message received');
            SessionState.ws.close();
            SessionState.connectionStatus = ConnectionState.DISCONNECTED;
            SessionState.ws               = null;
            SessionState.sessionInfo      = null;

            switch(msg.getConnectionFailed().getStatus()) {
              case RealtimeProto.ConnectionFailed.StatusCode.INTERNAL_ERROR:
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_INTERNAL_ERROR);
                break;
              case RealtimeProto.ConnectionFailed.StatusCode.INVALID_MESSAGE:
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_INVALID_MESSAGE);
                break;
              case RealtimeProto.ConnectionFailed.StatusCode.PROTOCOL_ERROR:
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_PROTOCOL_ERROR);
                break;
              case RealtimeProto.ConnectionFailed.StatusCode.NETWORK_ERROR:
              case RealtimeProto.ConnectionFailed.StatusCode.CONNECT_TIMEOUT:
                if (SessionState.reconnectFlag) {
                    if (connectionListener.onReconnecting)
                        connectionListener.onReconnecting(StatusCode.STATUS_NETWORK_ERROR);
                    reconnectSession(connectionListener);
                    }
                else {
                    SessionState.retries = 0;
                    if (connectionListener.onConnectionFailed)
                        connectionListener.onConnectionFailed(StatusCode.STATUS_NETWORK_ERROR);
                }
                break;
              case RealtimeProto.ConnectionFailed.StatusCode.PERMISSION_DENIED:
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_PERMISSION_DENIED);
                break;
              case RealtimeProto.ConnectionFailed.StatusCode.ALREADY_CONNECTED:
                SessionState.retries = 0;
                if (connectionListener.onConnectionFailed)
                    connectionListener.onConnectionFailed(StatusCode.STATUS_ALREADY_CONNECTED);
                break;
            }
            break;

          case OutMessage.Type.CONNECTION_CLOSED:
            console.log('CONNECTION_CLOSED message received');
            switch(msg.getConnectionClosed().getStatus()) {
              case RealtimeProto.ConnectionClosed.StatusCode.SESSION_CLOSED:
                SessionState.ws.close();
                SessionState.connectionStatus    = ConnectionState.DISCONNECTED;
                SessionState.ws                  = null;
                SessionState.sessionId           = null;
                SessionState.sessionInfo         = null;
                SessionState.currentRoom         = null;
                SessionState.retries             = 0;
                SessionState.lastMsgid           = 0;
                SessionState.lastAckid           = 0;
                SessionState.lastRealiableId     = 0;
                SessionState.lastUnreliableIds   = {};
                SessionState.inmsgQueue          = {};
                SessionState.outmsgQueue         = {};
                SessionState.roomListeners       = {};
                SessionState.rcvMessageListeners = {};
                SessionState.sndMessageListeners = {};

                if (connectionListener.onConnectionClosed)
                    connectionListener.onConnectionClosed(StatusCode.STATUS_SESSION_CLOSED);
                break;
              case RealtimeProto.ConnectionClosed.StatusCode.REPLACED_BY_NEW_CONNECTION:
                SessionState.ws.close();
                SessionState.connectionStatus = ConnectionState.DISCONNECTED;
                SessionState.ws               = null;
                SessionState.sessionInfo      = null;
                SessionState.retries          = 0;

                if (connectionListener.onConnectionClosed)
                    connectionListener.onConnectionClosed(StatusCode.STATUS_REPLACED_BY_NEW_CONNECTION);
                break;
              case RealtimeProto.ConnectionClosed.StatusCode.UNRESPONSIVE_CLIENT:
                SessionState.ws.close();
                SessionState.connectionStatus = ConnectionState.DISCONNECTED;
                SessionState.ws               = null;
                SessionState.sessionInfo      = null;

                if (SessionState.reconnectFlag) {
                    if (connectionListener.onReconnecting)
                        connectionListener.onReconnecting(StatusCode.STATUS_NETWORK_ERROR);
                    reconnectSession(connectionListener);
                    }
                else {
                    SessionState.retries = 0;
                    if (connectionListener.onConnectionFailed)
                        connectionListener.onConnectionFailed(StatusCode.STATUS_NETWORK_ERROR);
                }
                break;
              case RealtimeProto.ConnectionClosed.StatusCode.NEW_SERVER_LOCATION:
                SessionState.host    = msg.getConnectionClosed().getHostname();
                SessionState.port    = msg.getConnectionClosed().getPort();
                SessionState.retries = 0;

                if (isConnected()) {
                    if (connectionListener.onReconnecting)
                        connectionListener.onReconnecting(StatusCode.STATUS_NEW_SERVER_LOCATION);
                }
                connect(connectionListener);
                break;
            }
            break;

          case OutMessage.Type.SYNC:
            console.log('SYNC message received');
            SessionState.mmLatency          = msg.getSync().latency;
            SessionState.mmClockLastUpdate -= msg.getSync().latency;
            break;

          case OutMessage.Type.PING:
            console.log('PING message received');
            SessionState.mmTime            = msg.getPing().getTimestamp();
            SessionState.mmClockLastUpdate = getMonotonicTime();

            var reply = new RealtimeProto.Pong(msg.getPing().getId(), msg.getPing().getTimestamp());
            var inmsg = new InMessage();
            inmsg.setMsgid(getMmTime());
            inmsg.setAckid(SessionState.lastRealiableId);
            inmsg.setIsReliable(false);
            inmsg.setType(InMessage.Type.PONG);
            inmsg.setPong(reply);
            sendMessage(inmsg);
            break;

          case OutMessage.Type.ROOM_CREATED:
            console.log('ROOM_CREATED message received');
            var room     = msg.getRoomCreated().room;
            var listener = SessionState.roomListeners[room.getRoomId()];

            switch (msg.getRoomCreated().status) {
              case RealtimeProto.RoomCreated.StatusCode.SUCCESS:

                var state;
                switch (room.getMatchState()) {
                  case RealtimeProto.MatchState.PENDING:
                    state = MatchState.PENDING;
                    break;
                  case RealtimeProto.MatchState.READY:
                    state = MatchState.READY;
                    break;
                  case RealtimeProto.MatchState.RUNNING:
                    state = MatchState.RUNNING;
                    break;
                  case RealtimeProto.MatchState.FINISHED:
                    state = MatchState.FINISHED;
                    break;
                  default:
                    state = MatchState.PENDING;
                    break;
                }

                SessionState.currentRoom = new Scoreflex.Realtime.Room(
                    room.getRoomId(), state,
                    protoMapToRealtimeMap(room.getConfig()),
                    protoMapToRealtimeMap(room.getProperties()),
                    room.getPlayers()
                );
                if (listener.onRoomCreated)
                    listener.onRoomCreated(StatusCode.STATUS_SUCCESS, SessionState.currentRoom);
                break;

              case RealtimeProto.RoomCreated.StatusCode.INTERNAL_ERROR:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomCreated)
                    listener.onRoomCreated(StatusCode.STATUS_INTERNAL_ERROR);
                break;

              case RealtimeProto.RoomCreated.StatusCode.PERMISSION_DENIED:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomCreated)
                    listener.onRoomCreated(StatusCode.STATUS_PERMISSION_DENIED);
                break;

              case RealtimeProto.RoomCreated.StatusCode.INVALID_DATA:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomCreated)
                    listener.onRoomCreated(StatusCode.STATUS_INVALID_DATA);
                break;

              case RealtimeProto.RoomCreated.StatusCode.ALREADY_CREATED:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomCreated)
                    listener.onRoomCreated(StatusCode.STATUS_ROOM_ALREADY_CREATED);
                break
            }
            break;

          case OutMessage.Type.ROOM_CLOSED:
            console.log('ROOM_CLOSED message received');
            var roomId = msg.getRoomClosed().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;

            SessionState.currentRoom = null;
            var listener = SessionState.roomListeners[roomId];
            delete SessionState.rcvMessageListeners[roomId];
            delete SessionState.roomListeners[roomId];

            switch (msg.getRoomClosed().status) {
              case RealtimeProto.RoomClosed.StatusCode.INTERNAL_ERROR:
                if (listener.onRoomClosed)
                    listener.onRoomClosed(StatusCode.STATUS_INTERNAL_ERROR, roomId);
                break;

              case RealtimeProto.RoomClosed.StatusCode.ROOM_CLOSED:
                if (listener.onRoomClosed)
                    listener.onRoomClosed(StatusCode.STATUS_ROOM_CLOSED, roomId);
                break;
            }

            break;

          case OutMessage.Type.ROOM_JOINED:
            console.log('ROOM_JOINED message received');
            var room     = msg.getRoomJoined().room;
            var listener = SessionState.roomListeners[room.getRoomId()];

            switch (msg.getRoomJoined().status) {
              case RealtimeProto.RoomJoined.StatusCode.SUCCESS:

                var state;
                switch (room.getMatchState()) {
                  case RealtimeProto.MatchState.PENDING:
                    state = MatchState.PENDING;
                    break;
                  case RealtimeProto.MatchState.READY:
                    state = MatchState.READY;
                    break;
                  case RealtimeProto.MatchState.RUNNING:
                    state = MatchState.RUNNING;
                    break;
                  case RealtimeProto.MatchState.FINISHED:
                    state = MatchState.FINISHED;
                    break;
                  default:
                    state = MatchState.PENDING;
                    break;
                }

                SessionState.currentRoom = new Scoreflex.Realtime.Room(
                    room.getRoomId(), state,
                    protoMapToRealtimeMap(room.getConfig()),
                    protoMapToRealtimeMap(room.getProperties()),
                    room.getPlayers()
                );
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_SUCCESS, SessionState.currentRoom);
                break;

              case RealtimeProto.RoomJoined.StatusCode.INTERNAL_ERROR:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_INTERNAL_ERROR);
                break;

              case RealtimeProto.RoomJoined.StatusCode.PERMISSION_DENIED:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_PERMISSION_DENIED);
                break;

              case RealtimeProto.RoomJoined.StatusCode.ROOM_NOT_FOUND:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_ROOM_NOT_FOUND);
                break;

              case RealtimeProto.RoomJoined.StatusCode.STRATEGY_MISMATCH:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_STRATEGY_MISMATCH);
                break

              case RealtimeProto.RoomJoined.StatusCode.ROOM_FULL:
                delete SessionState.roomListeners[room.getRoomId()];
                delete SessionState.rcvMessageListeners[room.getRoomId()];
                if (listener.onRoomJoined)
                    listener.onRoomJoined(StatusCode.STATUS_ROOM_FULL);
                break
            }
            break;

          case OutMessage.Type.ROOM_LEFT:
            console.log('ROOM_LEFT message received');
            var roomId = msg.getRoomLeft().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;

            SessionState.currentRoom = null;
            var listener = SessionState.roomListeners[roomId];
            delete SessionState.rcvMessageListeners[roomId];
            delete SessionState.roomListeners[roomId];

            switch (msg.getRoomLeft().status) {
              case RealtimeProto.RoomLeft.StatusCode.SUCCESS:
                if (listener.onRoomLeft)
                    listener.onRoomLeft(StatusCode.STATUS_SUCCESS, roomId);
                break;

              case RealtimeProto.RoomLeft.StatusCode.ROOM_NOT_JOINED:
                if (listener.onRoomLeft)
                    listener.onRoomLeft(StatusCode.STATUS_SUCCESS, roomId);
                break;

              case RealtimeProto.RoomLeft.StatusCode.INTERNAL_ERROR:
                if (listener.onRoomLeft)
                    listener.onRoomLeft(StatusCode.STATUS_INTERNAL_ERROR, roomId);
                break;
            }
            break;

          case OutMessage.Type.PEER_JOINED_ROOM:
            console.log('PEER_JOINED_ROOM message received');
            var roomId = msg.getPeerJoinedRoom().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;
            SessionState.currentRoom.addParticipant(msg.getPeerJoinedRoom().getPlayerId());
            var listener = SessionState.roomListeners[roomId];
            if (listener.onPeerJoined)
                listener.onPeerJoined(SessionState.currentRoom, msg.getPeerJoinedRoom().getPlayerId());
            break;

          case OutMessage.Type.PEER_LEFT_ROOM:
            console.log('PEER_LEFT_ROOM message received');
            var roomId = msg.getPeerLeftRoom().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;
            SessionState.currentRoom.removeParticipant(msg.getPeerLeftRoom().getPlayerId());
            var listener = SessionState.roomListeners[roomId];
            if (listener.onPeerLeft)
                listener.onPeerLeft(SessionState.currentRoom, msg.getPeerLeftRoom().getPlayerId());
            break;

          case OutMessage.Type.MATCH_STATE_CHANGED:
            console.log('MATCH_STATE_CHANGED message received');
            var roomId = msg.getMatchStateChanged().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;

            var listener = SessionState.roomListeners[roomId];
            switch (msg.getMatchStateChanged().status) {
              case RealtimeProto.MatchStateChanged.StatusCode.SUCCESS:
                var state;
                switch (msg.getMatchStateChanged().getMatchState()) {
                  case RealtimeProto.MatchState.PENDING:
                    state = MatchState.PENDING;
                    break;
                  case RealtimeProto.MatchState.READY:
                    state = MatchState.READY;
                    break;
                  case RealtimeProto.MatchState.RUNNING:
                    state = MatchState.RUNNING;
                    break;
                  case RealtimeProto.MatchState.FINISHED:
                    state = MatchState.FINISHED;
                    break;
                  default:
                    state = SessionState.currentRoom.getMatchState();
                    break;
                }
                var oldState = SessionState.currentRoom.setMatchState(state);
                if (listener.onMatchStateChanged)
                    listener.onMatchStateChanged(StatusCode.STATUS_SUCCESS,
                                                 SessionState.currentRoom, oldState, state);
                break;

              case RealtimeProto.MatchStateChanged.StatusCode.ROOM_NOT_JOINED:
                if (listener.onMatchStateChanged)
                    listener.onMatchStateChanged(StatusCode.STATUS_ROOM_NOT_JOINED,
                                                 SessionState.currentRoom);
                break;

              case RealtimeProto.MatchStateChanged.StatusCode.BAD_STATE:
                if (listener.onMatchStateChanged)
                    listener.onMatchStateChanged(StatusCode.STATUS_BAD_STATE,
                                                 SessionState.currentRoom);
                break;

              case RealtimeProto.MatchStateChanged.StatusCode.PERMISSION_DENIED:
                if (listener.onMatchStateChanged)
                    listener.onMatchStateChanged(StatusCode.STATUS_PERMISSION_DENIED,
                                                 SessionState.currentRoom);
                break;
            }
            break;

          case OutMessage.Type.ROOM_PROPERTY_UPDATED:
            console.log('ROOM_PROPERTY_UPDATED message received');
            var roomId = msg.getRoomPropertyUpdated().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;

            var prop     = mapEntryToPair(msg.getRoomPropertyUpdated().getProperty());
            var listener = SessionState.roomListeners[roomId];
            switch (msg.getRoomPropertyUpdated().status) {
              case RealtimeProto.RoomPropertyUpdated.StatusCode.SUCCESS:
                if (prop.value == null) {
                    SessionState.currentRoom.removeProperty(prop.name);
                }
                else {
                    SessionState.currentRoom.addProperty(prop.name, prop.value, prop.type);
                }
                if (listener.onRoomPropertyChanged)
                    listener.onRoomPropertyChanged(SessionState.currentRoom,
                                                   msg.getRoomPropertyUpdated().getPlayerId(),
                                                   prop.name);
                break;

              case RealtimeProto.RoomPropertyUpdated.StatusCode.ROOM_NOT_JOINED:
                if (listener.onSetRoomPropertyFailed)
                    listener.onSetRoomPropertyFailed(StatusCode.STATUS_ROOM_NOT_JOINED,
                                                     SessionState.currentRoom, prop.name);
                break;

              case RealtimeProto.RoomPropertyUpdated.StatusCode.UPDATE_FORBIDDEN:
                if (listener.onSetRoomPropertyFailed)
                    listener.onSetRoomPropertyFailed(StatusCode.STATUS_UPDATE_FORBIDDEN,
                                                     SessionState.currentRoom, prop.name);
                break;
            }
            break;

          case OutMessage.Type.ROOM_MESSAGE:
            console.log('ROOM_MESSAGE message received');
            var roomId = msg.getRoomMessage().getRoomId();

            if (SessionState.currentRoom == null || roomId != SessionState.currentRoom.getId())
                return;

            var payload  = protoMapToRealtimeMap(msg.getRoomMessage().getPayload());
            var listener = SessionState.rcvMessageListeners[roomId];
            if (listener.onMessageReceived)
                listener.onMessageReceived(SessionState.currentRoom,
                                           msg.getRoomMessage().getFromId(),
                                           msg.getRoomMessage().getTag(),
                                           payload);
            break;

          case OutMessage.Type.ACK:
            console.log('ACK message received');
            var msgId = msg.getAck().getMsgid();

            var listener = SessionState.sndMessageListeners[msgId];
            delete SessionState.sndMessageListeners[msgId];

            switch (msg.getAck().status) {
              case RealtimeProto.Ack.StatusCode.INTERNAL_ERROR:
                if (listener.onSuccess)
                    listener.onFailure(StatusCode.STATUS_INTERNAL_ERROR, msgId);
                break;
              case RealtimeProto.Ack.StatusCode.ROOM_NOT_JOINED:
                if (listener.onSuccess)
                    listener.onFailure(StatusCode.STATUS_ROOM_NOT_JOINED, msgId);
                break;
              case RealtimeProto.Ack.StatusCode.PEER_NOT_FOUND:
                if (listener.onSuccess)
                    listener.onFailure(StatusCode.STATUS_PEER_NOT_FOUND, msgId);
                break;
              case RealtimeProto.Ack.StatusCode.INVALID_MESSAGE:
                if (listener.onSuccess)
                    listener.onFailure(StatusCode.STATUS_INVALID_MESSAGE, msgId);
                break;
              default:
                if (listener.onSuccess)
                    listener.onSuccess(msgId);
                break;
            }
            break;
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var mapEntryToPair = function(entry) {
        switch (entry.type) {
          case RealtimeProto.MapEntry.Type.INT32:
            return {name: entry.name, value: entry.int32_val, type: 'INT32'};
          case RealtimeProto.MapEntry.Type.UINT32:
            return {name: entry.name, value: entry.uint32_val, type: 'UINT32'};
          case RealtimeProto.MapEntry.Type.SINT32:
            return {name: entry.name, value: entry.sint32_val, type: 'SINT32'};
          case RealtimeProto.MapEntry.Type.INT64:
            return {name: entry.name, value: entry.int64_val, type: 'INT64'};
          case RealtimeProto.MapEntry.Type.UINT64:
            return {name: entry.name, value: entry.uint64_val, type: 'UINT64'};
          case RealtimeProto.MapEntry.Type.SINT64:
            return {name: entry.name, value: entry.sint64_val, type: 'SINT64'};
          case RealtimeProto.MapEntry.Type.BOOL:
            return {name: entry.name, value: entry.bool_val, type: 'BOOL'};
          case RealtimeProto.MapEntry.Type.DOUBLE:
            return {name: entry.name, value: entry.double_val, type: 'DOUBLE'};
          case RealtimeProto.MapEntry.Type.STRING:
            return {name: entry.name, value: entry.string_val, type: 'STRING'};
          case RealtimeProto.MapEntry.Type.BYTES:
            return {name: entry.name, value: entry.bytes_val, type: 'BYTES'};
          default:
            return {name: entry.name, value: null, type: 'VOID'};
        }
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var protoMapToRealtimeMap = function(pmap) {
        var rtmap = new Scoreflex.Realtime.Map();
        for (var i in pmap) {
            var obj = mapEntryToPair(pmap[i]);
            rtmap.putTypedValue(obj.name, obj.value, obj.type);
        }
        return rtmap;
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var pairToMapEntry = function(key, value, type) {
        var entry = new RealtimeProto.MapEntry();
        entry.setName(key);
        switch (type) {
        case 'SINT32':
            entry.setType(RealtimeProto.MapEntry.Type.SINT32);
            entry.setSint32Val(value);
            break;
        case 'INT32':
            entry.setType(RealtimeProto.MapEntry.Type.INT32);
            entry.setInt32Val(value);
            break;
        case 'UINT32':
            entry.setType(RealtimeProto.MapEntry.Type.UINT32);
            entry.setUint32Val(value);
            break;
        case 'SINT64':
            entry.setType(RealtimeProto.MapEntry.Type.SINT64);
            entry.setSint64Val(value);
            break;
        case 'INT64':
            entry.setType(RealtimeProto.MapEntry.Type.INT64);
            entry.setInt64Val(value);
            break;
        case 'UINT64':
            entry.setType(RealtimeProto.MapEntry.Type.UINT64);
            entry.setUint64Val(value);
            break;
        case 'DOUBLE':
            entry.setType(RealtimeProto.MapEntry.Type.DOUBLE);
            entry.setDoubleVal(value);
            break;
        case 'BOOL':
            entry.setType(RealtimeProto.MapEntry.Type.BOOL);
            entry.setBoolVal(value);
            break;
        case 'STRING':
            entry.setType(RealtimeProto.MapEntry.Type.STRING);
            entry.setStringVal(value);
            break;
        case 'BYTES':
            entry.setType(RealtimeProto.MapEntry.Type.BYTES);
            entry.setBytesVal(Value);
            break;
        default: /* VOID */
            entry.setType(RealtimeProto.MapEntry.Type.VOID);
        }
        return entry;
    };

    /**
     * @instance
     * @memberof module:Scoreflex.Realtime.Session
     * @private
     */
    var realtimeMapToProtoMap = function(rtmap) {
        var pmap = {map: []};

        if (!(rtmap instanceof Scoreflex.Realtime.Map)) {
            rtmap = new Scoreflex.Realtime.Map(rtmap);
        }

        rtmap.forEach(function(key, value, type) {
            this.map.push(pairToMapEntry(key,value,type));
        }, pmap);
        return pmap.map;
    };

    // FIXME: should be remove
    var dumpState = function(key) {
        if (key) {
            console.log(SessionState[key]);
        }
        else {
            console.log(SessionState);
        }
    };
    //-- Session API

    this.initialize           = initialize;
    this.deinitialize         = deinitialize;
    this.isInitialized        = isInitialized;
    this.getServerAddr        = getServerAddr;
    this.setReconnectFlag     = setReconnectFlag;
    this.getReconnectFlag     = getReconnectFlag;
    this.setReconnectTimeout  = setReconnectTimeout;
    this.getReconnectTimeout  = getReconnectTimeout;
    this.setMaxRetries        = setMaxRetries;
    this.getMaxRetries        = getMaxRetries;
    this.getConnectionState   = getConnectionState;
    this.isConnected          = isConnected;
    this.getSessionInfo       = getSessionInfo;
    this.getCurrentRoom       = getCurrentRoom;
    this.connect              = connect;
    this.disconnect           = disconnect;
    this.createRoom           = createRoom;
    this.joinRoom             = joinRoom;
    this.leaveRoom            = leaveRoom;
    this.startMatch           = startMatch;
    this.stopMatch            = stopMatch;
    this.resetMatch           = resetMatch;
    this.setRoomProperty      = setRoomProperty;
    this.sendUnreliableMessage= sendUnreliableMessage;
    this.sendReliableMessage  = sendReliableMessage;

        // FIXME: should be removed
    this.dumpState            = dumpState;
};


/*=============================== Listeners ================================*/

// ==========================================
// ======= SessionInitializedListener =======
// ==========================================
/**
 * Contains callbacks used by the [realtime session]{@link
 * module:Scoreflex.Realtime.Session} to notify the application of the result of
 * its initialization.
 *
 * @class SessionInitializedListener
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.SessionInitializedListener = function RealtimeSessionInitializedListener() {
    /**
     * Called if the [realtime session]{@link module:Scoreflex.Realtime.Session}
     * initialization succeeds.
     *
     * @memberof module:Scoreflex.Realtime.SessionInitializedListener
     * @public
     */
    onInitialized = function() {},

    /**
     * Called when an error occurred during the [realtime session]{@link
     * module:Scoreflex.Realtime.Session} initialization. Possible status codes
     * are:
     *
     * <ul>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} A network
     *   error occurred.
     *   <li>[STATUS_PERMISSION_DENIED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PERMISSION_DENIED} The
     *   application does not have permissions to use the realtime service.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} A
     *   unexpected error occurred.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status The operation
     * status code.
     *
     * @memberof module:Scoreflex.Realtime.SessionInitializedListener
     * @public
     */
    onInitializationFailed = function(status) {},

    /**
     * Called when the [realtime session]{@link
     * module:Scoreflex.Realtime.Session} is deinitialized. This happens when
     * [Scoreflex.SDK#destroyRealtimeSession]{@link
     * module:Scoreflex.SDK.destroyRealtimeSession} is called or when the
     * current player has changed.
     *
     * @memberof module:Scoreflex.Realtime.SessionInitializedListener
     * @public
     */
    onDeinitialized = function() {}
};


// ============================================
// ============ ConnectionListener ============
// ============================================
/**
 * An interface that contains the callbacks used by the [realtime session]{@link
 * module:Scoreflex.Realtime.Session} to notify the application when the
 * connection's state changes.
 *
 * @class ConnectionListener
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.ConnectionListener = function RealtimeConnectionListener() {
    /**
     * This method is called asynchronously after a call to
     * [Session.connect]{@link module:Scoreflex.Realtime.Session#connect} if the
     * connection is successfully established. It can also be called when during
     * an automatic reconnection.
     * <br>
     * After this callback, the connection's state is [CONNECTED]{@link
     * module:Scoreflex.Realtime.ConnectionState.CONNECTED} and the player can
     * try to create/join/leave rooms and exchange data with room's
     * participants.
     *
     * @param {module:Scoreflex.Realtime.Map} sessionInfo Contains information
     * about the player's session.
     *
     * @memberof module:Scoreflex.Realtime.ConnectionListener
     * @public
     */
    onConnected = function(sessionInfo) {},

    /**
     * This method is called when an error occurred on the connection. After
     * this call, the connection's state is [DISCONNECTED]{@link
     * module:Scoreflex.Realtime.ConnectionState.DISCONNECTED}.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} A network
     *   error occurred.</li>
     *   <li>[STATUS_PERMISSION_DENIED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PERMISSION_DENIED} The
     *   player does not have permissions to use the realtime service.</li>
     *   <li>[STATUS_INVALID_MESSAGE]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INVALID_MESSAGE} An
     *   malformed message was sent to the server.</li>
     *   <li>[STATUS_PROTOCOL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PROTOCOL_ERROR} An unknown
     *   message was sent to the server.</li>
     *   <li>[STATUS_ALREADY_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ALREADY_CONNECTED} The
     *   player has already a opened session on another device.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} A
     *   unexpected error occurred.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indicating the reason of the connection failure.
     *
     * @memberof module:Scoreflex.Realtime.ConnectionListener
     * @public
     */
    onConnectionFailed = function(status) {}

    /**
     * This method is called when the player's session is closed or when a
     * connection is replaced by a new one. It can be called from the time the
     * connection is established.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SESSION_CLOSED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_CLOSED} The
     *   player's session was closed on the server side. He was unsubscribe from
     *   joined room, if any and all registered listeners was removed. After
     *   this call, the connection's state is [DISCONNECTED]{@link
     *   module:Scoreflex.Realtime.ConnectionState.DISCONNECTED}</li>
     *   <li>[STATUS_REPLACED_BY_NEW_CONNECTION]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_REPLACED_BY_NEW_CONNECTION}
     *   The current connection was closed by a new one. This is an informative
     *   reason and it could be ignored.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indicating the reason of the connection closure.
     *
     * @memberof module:Scoreflex.Realtime.ConnectionListener
     * @public
     */
    onConnectionClosed = function(status) {},

    /**
     * This method is called to notify the application that the connection needs
     * to be reopenned.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} A network
     *   error occurred. If automatic reconnection was configured, when a
     *   network error is detected, the connection will be automatically
     *   reopened.</li>
     *   <li>[STATUS_NEW_SERVER_LOCATION]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NEW_SERVER_LOCATION} The
     *   server requests the client to reconnect on a specific host.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indicating the reason of the reconnection.
     *
     * @memberof module:Scoreflex.Realtime.ConnectionListener
     * @public
     */
    onReconnecting = function(status) {}
};


// ====================================
// =========== RoomListener ===========
// ====================================
/**
 * An interface that contains callbacks used by the [realtime session]{@link
 * module:Scoreflex.Realtime.Session} to notify the application when the state
 * of the room or the status of its participants change.
 *
 * @class RoomListener
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.RoomListener = function RealtimeRoomListener() {
    /**
     *
     * This method is called when a player attempts to create a realtime
     * room. If the room is successfully created, then the player joins the room
     * automatically.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SUCCESS]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SUCCESS} The room was
     *   successfully created.</li>
     *   <li>[STATUS_SESSION_NOT_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} The
     *   attempt to create the room failed because the player's session is not
     *   connected to the service.</li>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} The attempt
     *   to create the room failed due to a network error.</li>
     *   <li>[STATUS_PERMISSION_DENIED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PERMISSION_DENIED} The
     *   attempt to create the room failed because the player does not have
     *   permissions to create it.</li>
     *   <li>[STATUS_ROOM_ALREADY_CREATED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_ALREADY_CREATED} The
     *   attempt to create the room failed because another room with the some ID
     *   already exists.</li>
     *   <li>[STATUS_INVALID_DATA]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INVALID_DATA} The attempt
     *   to create the room because of an invalid room's configuration.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} The attempt
     *   to create the room due to an unexpected error.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the result of the operation.
     * @param {module:Scoreflex.Realtime.Room} room The room that was
     * created. If an error occurred, the room is <code>undefined</code>.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onRoomCreated = function(status, room) {},

    /**
     * This method is called when a realtime room is closed.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_ROOM_CLOSED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_CLOSED} The room was
     *   closed normally by an external way.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} The room
     *   was closed due to an unexpected error.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the reason of the closure.
     * @param {string} roomId The room's ID which was closed.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onRoomClosed = function(status, roomId) {},

    /**
     * This method is called when a client attempts to join realtime room.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SUCCESS]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SUCCESS} The player has
     *   joined the room successfully.</li>
     *   <li>[STATUS_SESSION_NOT_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} The
     *   attempt to join the room failed because the player's session is not
     *   connected to the service.</li>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} The attempt
     *   to join the room failed due to a network error.</li>
     *   <li>[STATUS_PERMISSION_DENIED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PERMISSION_DENIED} The
     *   attempt to join the room failed because the player does not have
     *   permissions to join it.</li>
     *   <li>[STATUS_ROOM_NOT_FOUND]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_NOT_FOUND} The attempt
     *   to join the room failed because the room does not exists.</li>
     *   <li>[STATUS_ROOM_FULL]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_FULL} The attempt to
     *   join the room failed because the maximum number of participants allowed
     *   to join the room was reached.</li>

     *   <li>[STATUS_STRATEGY_MISMATCH]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_STRATEGY_MISMATCH} The
     *   attempt to join the room's state does not match its join strategy.</li>

     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} The attempt
     *   to join the room failed due to an unexpected error.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the result of the operation.
     * @param {module:Scoreflex.Realtime.Room} room The room that was joined. If
     * an error occurred, the room is <code>undefined</code>.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onRoomJoined = function(status, room) {},

    /**
     * This method is called when a client attempts to leave a realtime room.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SUCCESS]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SUCCESS} The player has
     *   left the room successfully.</li>
     *   <li>[STATUS_SESSION_NOT_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} The
     *   attempt to leave the room failed because the player's session is not
     *   connected to the service.</li>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} The attempt
     *   to leave the room failed due to a network error.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} The attempt
     *   to leave the room failed due to an unexpected error.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the result of the operation.
     * @param {string} roomId The room's ID which was left.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onRoomLeft = function(status, roomId) {},

    /**
     * This method is called when a participant joins a room.
     *
     * @method onPeerJoined
     * @param {module:Scoreflex.Realtime.Room} room The room that the
     * participant joined.
     * @param {string} peerId The participant's ID that joins the room.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onPeerJoined = function(room, peerId) {},

    /**
     * This method is called when a participant leave a room.
     *
     * @method onPeerLeft
     * @param {module:Scoreflex.Realtime.Room} room The room that the
     * participant left.
     * @param {string} peerId The participant's ID that leaves the room.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onPeerLeft = function(room, peerId) {},

    /**
     * This method is called when the match's state of a room change. It can
     * change automatically or manually by calling [Session.startMatch]{@link
     * module:Scoreflex.Realtime.Session#startMatch}, [Session.stopMatch]{@link
     * module:Scoreflex.Realtime.Session#stopMatch} or
     * [Session.resetMatch]{@link module:Scoreflex.Realtime.Session#resetMatch}.
     * <br>
     * When a participant tries to change the match's state, if it succeed, all
     * participants will be notified. But, he will be the only one notified when
     * an error occurred.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SUCCESS]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SUCCESS} The match's state
     *   has changed.</li>
     *   <li>[STATUS_SESSION_NOT_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} The
     *   attempt to change the match's state failed because the player's session
     *   is not connected to the service.</li>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} The attempt
     *   to change the match's state failed due to a network error.</li>
     *   <li>[STATUS_ROOM_NOT_JOINED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_NOT_JOINED} The
     *   attempt to change the match's state failed because the player is not a
     *   room's participant.</li>
     *   <li>[STATUS_BAD_STATE]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_BAD_STATE} The attempt to
     *   change the match's state failed because the player tries to do an
     *   invalid change (e.g. the match cannot be stopped if it is not
     *   running).</li>
     *   <li>[STATUS_PERMISSION_DENIED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PERMISSION_DENIED} The
     *   attempt to change the match's state failed because the player does not
     *   have permissions to change it.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the result of the operation.
     * @param {module:Scoreflex.Realtime.Room} room The room.
     * @param {module:Scoreflex.Realtime.MatchState} oldState The old match's
     * state. If an error occurred, the state is <code>undefined</code>.
     * @param {module:Scoreflex.Realtime.MatchState} newState The new match's
     * state. If an error occurred, the state is <code>undefined</code>.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onMatchStateChanged = function(status, room, oldState, newState) {},

    /**
     * This method is called when a property of a room change. This is done by
     * calling [Session.setRoomProperty]{@link
     * module:Scoreflex.Realtime.Session#setRoomProperty}. If the operation
     * succeed, all participants will be notified.
     *
     * @method onRoomPropertyChanged
     * @param {module:Scoreflex.Realtime.Room} room The room.
     * @param {string} from The participant that performs the operation.
     * @param {string} key The property key that was changed.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onRoomPropertyChanged = function(room, from, key) {},

    /**
     * This method is called when a call to [Session.setRoomProperty]{@link
     * module:Scoreflex.Realtime.Session#setRoomProperty} failed.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_SESSION_NOT_CONNECTED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_SESSION_NOT_CONNECTED} The
     *   attempt to change the room's property failed because the player's
     *   session is not connected to the service.</li>
     *   <li>[STATUS_NETWORK_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_NETWORK_ERROR} The attempt
     *   to change the room's property failed due to a network error.</li>
     *   <li>[STATUS_ROOM_NOT_JOINED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_NOT_JOINED} The
     *   attempt to change the room's property failed because the player is not
     *   a room's participant.</li>
     *   <li>[STATUS_UPDATE_FORBIDDEN]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_UPDATE_FORBIDDEN} The
     *   attempt to change the room's property failed because the update is
     *   forbidden.</li>
     * </ul>
     *
     * @method onSetRoomPropertyFailed
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indication the result of the operation.
     * @param {module:Scoreflex.Realtime.Room} room The room.
     * @param {string} key The property key that was changed.
     *
     * @memberof module:Scoreflex.Realtime.RoomListener
     * @public
     */
    onSetRoomPropertyFailed = function(status, room, key) {}
};

// =====================================
// ====== MessageReceivedListener ======
// =====================================
/**
 * An interface that contains a callback used by the [realtime session]{@link
 * module:Scoreflex.Realtime.Session} to notify the application of messages
 * received from a participant.
 *
 * @class MessageReceivedListener
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.MessageReceivedListener = function RealtimeMessageReceivedListener() {
    /**
     * This method is called when the player receives a message from a
     * participant (reliable or not).
     *
     * @param {module:Scoreflex.Realtime.Room} room The room.
     * @param {string} the sender's ID.
     * @param {byte} the message's tag.
     * @param {module:Scoreflex.Realtime.Map} payload The message that was
     * received.
     *
     * @memberof module:Scoreflex.Realtime.MessageReceivedListener
     * @public
     */
    onMessageReceived = function(room, from, tag, payload) {}
};

// ====================================
// ======== MessageSentListener =======
// ====================================
/**
 * An interface that contains a callback used by the [realtime session]{@link
 * module:Scoreflex.Realtime.Session} to acknowledged the sent reliable
 * messages.
 *
 * @class MessageSentListener
 * @memberof module:Scoreflex.Realtime
 * @public
 */
Scoreflex.Realtime.MessageSentListener = function RealtimeMessageSentListener() {
    /**
     * This method was called when a reliable message was successfully
     * acknowledged.
     *
     * @param {integer} msgId The ID of the reliable message that was sent.
     *
     * @memberof module:Scoreflex.Realtime.MessageSentListener
     * @public
     */
    onSuccess = function(msgId) {},
    /**
     * This method was called when a reliable message acknowledged with an
     * error.
     * <br>
     * Possible status codes are:
     *
     * <ul>
     *   <li>[STATUS_ROOM_NOT_JOINED]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_ROOM_NOT_JOINED} The
     *   attempt to send message failed because the player has not joined the
     *   room.</li>
     *   <li>[STATUS_PEER_NOT_FOUND]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_PEER_NOT_FOUND} The attempt
     *   to send message failed because the recipient is not a room's
     *   participant.</li>
     *   <li>[STATUS_INVALID_MESSAGE]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INVALID_MESSAGE} The
     *   attempt to send message failed because the message is malformed.</li>
     *   <li>[STATUS_INTERNAL_ERROR]{@link
     *   module:Scoreflex.Realtime.StatusCode.STATUS_INTERNAL_ERROR} The attempt
     *   to send message failed due to an unexpected error.</li>
     * </ul>
     *
     * @param {module:Scoreflex.Realtime.StatusCode} status Status code
     * indicating the result of the operation.
     * @param {string} msgId The ID of the reliable message that was sent.
     *
     * @memberof module:Scoreflex.Realtime.MessageSentListener
     * @public
     */
    onFailure = function(status, msgId) {}
};
