const fs = require("fs");

function Response(res, options) {
  // send command sets status and header if not set
  this.send = function(data){
    if (typeof data === "string" && this.getHeader("Content-Type")) {
      this.setHeader("Content-Type", "text/html");
    }
    if(!res.statusCode){
      this.statusCode = 200;
    }
    this.end(data);
  };
  this.status = function(code){
    this.statusCode = code;
    return this;
  };
  this.type = function(type){
    this.setHeader("Content-Type", type);
    return this;
  };
  this.set = function(header, headerkey) {
    if (typeof header !== "object") {
      this.setHeader(header, headerkey);
    } else {
      for (let key in header) {
        this.setHeader({ key: header[key] });
      }
    }
    return this;
  };
  this.json = function(body){
    // set header to match json content
    this.setHeader("Content-Type", "application/json");
    // set status code to match
    if(!this.statusCode){
      this.statusCode = 200;
    }
    // send json
    this.end(JSON.stringify(body));
  };
  this.sendFile = function(filePath){
    // use fs to read a file from directory
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      if(!this.statusCode){
        this.statusCode = 200;
      }
      this.end(data);
    });
  };
  this.render = function(fileName, user_options) {
    // create the full options object with both user specified options and express options
    let option = {
      ...user_options,
      settings: options,
    }
    if(options.engine === null){
      throw 'No render engine specified.'
    }
    // check if view engine is handlebars
    if(options["view engine"] === "handlebars"){
      // add handle bar extension to file if not specified
      if(!/.handlebars/.test(fileName) || !/.hbs/.test(fileName)){
        fileName = fileName + '.' + options.extension;
      }
      // use engine specified in options
      options.engine(options.views + "\\" + fileName, option, (err, str) => {
        if(err) throw err;
        if(!this.statusCode){
          this.statusCode = 200;
        }
        // use send to send str
        this.send(str);
      });
    }
  };
  this.redirect = function(path) {
    // set res status code to redirect
    this.statusCode = 302;
    // set location header to proper path
    this.set('Location', path);
    // send the new header response
    this.end();
  }
}

function createRes(res, options){
  let r = new Response(res, options);
  Object.assign(res, r);
  return res;
}

module.exports = createRes;



