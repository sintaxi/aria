var xml2js = require('xml2js-expat')
var request = require('request')
var querystring = require('querystring')

module.exports = function(config) {
  
  var convertToJson = function(xml, cb){
    var parser = new xml2js.Parser(function(result, error){
      if (!error) {
        cb(result)
      }
    })
    parser.once('end', function(result){})
    parser.parseString(xml)
  }
  
  var makeJsonPretty = function(json, cb){
    var base = json["data"]["struct"]["var"]
    var obj = {}
    
    base.forEach(function(item){
      var k = item["@"]["name"]
      delete item["@"]
  
      // number
      if(item.hasOwnProperty("number")){
        var v = parseInt(item["number"])
        
      // string
      }else if(item.hasOwnProperty("string")){
        var v = item["string"]
    
      // null
      }else if(item.hasOwnProperty("null")){
        var v = null
        
      // array
      }else if(item.hasOwnProperty("array")){
        var v = []
  
        if(Array.isArray(item["array"]["struct"])){
          var array = item["array"]["struct"]
        }else{
          var array = [item["array"]["struct"]]
        }
        
        // iterate over each object
        array.forEach(function(inner_object_params){
          var inner_obj = {}
          
          // iterate over each object params
          inner_object_params["var"].forEach(function(param){
            var key = param["@"]["name"]
            delete param["@"]
  
            if(param.hasOwnProperty("number")){
              var val = parseInt(param["number"])
  
            }else if(param.hasOwnProperty("string")){
              var val = param["string"]
  
            }else if(param.hasOwnProperty("null")){
              var val = null
            }
            inner_obj[key] = val
          })
          
          v.push(inner_obj)
        })
      }
  
      obj[k] = v
    })
  
    cb(obj)
  }
  
  var post = function(method, params, cb) {
    var i, k, key, opts, pairs, v, value, _i, _len;
    pairs = [];
  
    // auth
    params["client_no"] = config.client_no
    params["auth_key"] = config.auth_key
    params["rest_call"] = method
  
    i = 0;
    for (key in params) {
      if (!Object.prototype.hasOwnProperty.call(params, key)) continue;
      value = params[key];
      k = querystring.escape(key);
      if (value instanceof Array) {
        for (_i = 0, _len = value.length; _i < _len; _i++) {
          v = value[_i];
          pairs[i++] = ("" + k + "=") + querystring.escape(v);
        }
      } else {
        pairs[i++] = ("" + k + "=") + querystring.escape(value);
      }
    }
  
    opts = {
      uri: config.url,
      method: "POST",
      body: pairs.join("&"),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  
    request.post(opts, function(err, rsp, body) {
      if (!err && rsp.statusCode == 200) {
        cb(body)
      }
    })
  
  }

  var req = function(method, params, cb){
    post(method, params, function(xml){
      convertToJson(xml, function(json){
        makeJsonPretty(json, function(obj){
          cb(obj)
        })
      })
    })
  }
  
  // public
  return {
    req: req,    
  }
  
}

