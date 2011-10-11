# Aria

A crappy wrapper for a crappy API. Basically makes request to API and parses the SOAP response.

## Installation

I always recommend you bundle your dependencies with your application. To do
this, create a `package.json` file in the root of your project with the minimum
information...

    {
      "name": "yourapplication",
      "verson": "0.0.1",
      "dependencies": {
        "aria": "0.1.0"
      }
    }

Then run the following command using npm...

    npm install

OR, if you just want to start playing with the library run...

    npm install aria

## Docs

    var aria = require("aria")({
      "url"       : "https://secure.future.stage.ariasystems.net/api/ws/api_ws_class_dispatcher.php",
      "client_no" : "abcdefg",
      "auth_key"  : "1234567890"
    })

Has only one public function.

### req(method, args, callback)
        
    aria.req("get_acct_no_from_user_id", { "user_id": "f2f4d962-cb44-4bc8-82c9-2d13bdd97128" }, function(result){
      console.log(result.error_code)
    })

## License   
    
Copyright 2011 Joyent
All rights reserved.

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.