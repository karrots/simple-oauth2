var exports = module.exports,
    request = require('request'),
    crypto  = require('crypto'),
    util    = require("util");


//
// Core module.
//
module.exports = function(config) {

	var errors = require("./error.js")();


	// High level method to call API
  function api(method, path, params, callback) {

    if(!callback || typeof(callback) !== 'function') {
      throw new Error('Callback not provided on API call');
    }

    if (process.env.DEBUG) console.log('OAuth2 Node Request');
    var url = config.client.site + path;

    call(method, url, params, function(error, response, body) {
      data(error, response, body, callback);
    });
  }


  // Make the HTTP request
  function call(method, url, params, callback) {

    var options = { uri: url, method: method }
    if (config.client) options.auth = { 'user': config.client.id, 'pass': config.client.secret }

    if (isEmpty(params)) params = null;
    method == 'GET' ? options.qs = params : options.json = params

    if (process.env.DEBUG) console.log('Simple OAuth2: Making the HTTP request', options)
    request(options, callback)
  }


  // Extract the data from the request response
  function data(error, response, body, callback) {

    if (error) throw new Error('Simple OAuth2: something went worng during the request');
    if (process.env.DEBUG) console.log('Simple OAuth2: checking response body', body);

    if (response.statusCode >= 400) return callback(new errors.HTTPError(response.statusCode), null)
    callback(error, body);
  }


  function isEmpty(ob){
    for(var i in ob){ return false;}
    return true;
  }


  return {
    'call': call,
    'data': data,
    'api': api,
  }
};