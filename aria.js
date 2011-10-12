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
  
  var parse = function(item){
    var obj = {};
    var val;

    // data
    if(item.hasOwnProperty("data")){
      return parseData(item["data"])

    // array
    }else if(item.hasOwnProperty("array")){
      return parseArray(item["array"])

    // struct
    }else if(item.hasOwnProperty("struct")){
      return parseStruct(item["struct"])

    // var
    }else if(item.hasOwnProperty("var")){
      return parseVar(item["var"])

    // number
    }else if(item.hasOwnProperty("number")){
      return parseNumber(item["number"])

    // string
    }else if(item.hasOwnProperty("string")){
      return parseString(item["string"])

    // null
    }else if(item.hasOwnProperty("null")){
      return null

    }else{
     console.log("Oops")
    }

    obj[item["@"]["name"]] = val
    return obj
  }
  
  var parseVar = function(varr){
    var obj = {}
    varr.forEach(function(item){
      obj[item["@"]["name"]] = parse(item)
    })
    return obj
  }

  var parseNumber = function(number){
    return parseInt(number)
  }

  var parseString = function(string){
    return string
  }

  var parseArray = function(array){
    if(array["@"] && array["@"]["length"] && array["@"]["length"] == 1){
      return [parseStruct(array["struct"])]
    }else{
      return parseStruct(array["struct"])
    }
  }

  var parseStruct = function(struct){
    if(struct.constructor == Array){
      var a = []
      struct.forEach(function(s){
        a.push(parseVar(s["var"]))
      })
      return a
    }else{
      return parseVar(struct["var"])
    }
  }

  var parseData = function(data){
    return parseStruct(data["struct"])
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
        cb(parse(json))
      })
    })
  }
  
  // public
  return {
    req: req,    
  }
  
}

