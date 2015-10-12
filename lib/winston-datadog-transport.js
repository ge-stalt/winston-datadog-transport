/*
 * winston-datadog-transport - Transport for outputting to a datadog database
 *
 * License : Public domain
 */

var util = require('util'),
    winston = require('winston'),
    os = require('os');
var dogapi = require("dogapi");

//
// ### function datadog (options)
// Constructor for the datadog transport object.
//
var datadog = exports.datadog = function (options) {

    //datadog provide a lot of default options so we don't need to do useless override
    //https://github.com/felixge/node-datadog#connection-options
    this.options = options || {};

    // If there is a datadog api key set then initialise the dog api.

    //Only user/database/table are required
    if (!options.api_key)
        throw new Error('api_key is required');

    if (!options.app_key)
        throw new Error('app_key is required');

    if (!options.source_type_name)
        throw new Error('source_type_name is required');

    console.log("DOG API INITIALISED");

    dogapi.initialize(options);

    //Connection pool for a datadogServer
    //this.pool = datadog.createPool(options);
}

//
// Inherit from `winston.Transport`.
//
util.inherits(datadog, winston.Transport);

//
// Define a getter so that `winston.transports.datadog`
// is available and thus backwards compatible.
//
winston.transports.datadog = datadog;

//
// Expose the name of this Transport on the prototype
//
datadog.prototype.name = 'datadog';

//
// ### function log (level, msg, [meta], callback)
// #### @level {string} Level at which to log the message.
// #### @msg {string} Message to log
// #### @meta {Object} **Optional** Additional metadata to attach
// #### @callback {function} Continuation to respond to when complete.
// Core logging method exposed to Winston. Metadata is optional.
//
datadog.prototype.log = function (level, msg, meta, callback) {
    var self = this;

    process.nextTick(function () {

        if ((level === "error") || (level === "warning")) {
            var properties = {
                "date_happened": parseInt(new Date().getTime() / 1000),
                "host": os.hostname(),
                "alert_type": level
            };
            var text;
            if (typeof meta === 'object' && Object.keys(meta).length > 0) {
                if (meta.type === 'string') {
                    text = meta.message;
                } else {
                    text = JSON.stringify(meta);
                }
            } else {
                
                // If the msg is longer than will fit in the title...
                if (msg.length > 99) {
                    text=msg;
                } else {
                    text= null;
                }
                
            }
            dogapi.event.create(level+":"+ msg,  text
                , properties, function (err, res) {
                if (err)
                    return onError(err);
                self.emit('logged');
                callback(null, true);
            })
        }
        else if (level === "info") {
            dogapi.metric.send_all(meta, function (err, results) {
                if (err)
                    return onError(err);
                self.emit('logged');
                callback(null, true);
            })
        }
    })
}

//
// ### function open (callback)
// #### @callback {function} Continuation to respond to when complete
// Attempts to open a new connection to the datadog server.
//
datadog.prototype.open = function (callback) {
    // Connectionless
    callback(null, connection)
}

// ### function close ()
// Close a connection
//
datadog.prototype.close = function (connection) {
    //Connectionless
}
