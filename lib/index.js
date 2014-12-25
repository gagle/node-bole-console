"use strict";

var util = require ("util");
var stream = require ("stream");

var colors = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  gray: 90
};

var levelColors = {
  debug: colors.gray,
  info: colors.green,
  warn: colors.yellow,
  error: colors.red
};

var defaultProperties = {
  time: true,
  hostname: true,
  pid: true,
  level: true,
  name: true,
  message: true
};

var ConsoleStream = function (options){
  stream.Writable.call (this);

  options = options || {};

  this._timestamp = options.timestamp;
  this._hostname = options.hostname;
  this._pid = options.pid;
  this._indent = options.indent || 2;
  this._colors = options.colors || true;
  this._requestDetails = options.requestDetails;
};

util.inherits (ConsoleStream, stream.Writable);

var localTime = function (isoDate){
  var date = new Date (isoDate);
  var tzo = -date.getTimezoneOffset ();
  var diff = tzo >= 0 ? "+" : "-";
  var pad = function (n){
    return (n < 10 ? "0" : "") + n;
  };

  return date.getFullYear ()
      + "-" + pad (date.getMonth () + 1)
      + "-" + pad (date.getDate ())
      + "T" + pad (date.getHours ())
      + ":" + pad (date.getMinutes ())
      + ":" + pad (date.getSeconds ())
      + diff
      + pad (Math.abs (Math.floor (tzo/60)))
      + pad (Math.abs (Math.floor (tzo%60)));
};

ConsoleStream.prototype._write = function (chunk, encoding, cb){
  var obj = JSON.parse (chunk.toString ());
  var str = "";

  if (this._timestamp) str += localTime (obj.time) + " ";
  if (this._hostname) str +=  "[" + obj.hostname + "] ";
  if (this._pid) str +=  "[" + obj.pid + "] ";

  str += this._colorize (levelColors[obj.level], obj.level) +
      this._colorize(colors.magenta, " [" + obj.name + "]") + ":";

  if (obj.message) str +=  " " + obj.message;
  if (obj.err){
    var trace = obj.err.message || obj.err.name;
    trace = obj.err.stack.substring (obj.err.stack.indexOf (trace) +
        trace.length + 1);
    str += (obj.message ? " - " : " ") +
        this._colorize (colors.cyan, obj.err.name + ": " + obj.err.message);
    if (trace) str += "\n" + trace;
  }else if (obj.req){
    str += (obj.message ? " - " : " ") +
        this._colorize (colors.cyan, obj.req.method + " " + obj.req.url);
    obj.req.method = undefined;
    obj.req.url = undefined;
    if (this._requestDetails){
      str += "\n" + JSON.stringify (obj.req, null, this._indent);
    }
  }else{
    var arbitraryObject = {};
    var content;

    for (var p in obj){
      if (!defaultProperties[p]){
        content = true;
        arbitraryObject[p] = obj[p];
      }
    }

    if (content){
      str += "\n" + JSON.stringify (arbitraryObject, null, this._indent);
    }
  }

  process.stdout.write (str + "\n");

  cb ();
};

ConsoleStream.prototype._colorize = function (color, message){
  return this._colors
      ? "\u001b[" + color + "m" + message + "\u001b[0m"
      : message;
};

module.exports = function (options){
  return new ConsoleStream (options);
};