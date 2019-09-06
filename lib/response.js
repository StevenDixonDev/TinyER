const fs = require("fs");

function Response(res, options) {
  // send command sets status and header if not set
  this.send = data => {
    if (typeof data === "string" && res.getHeader("Content-Type")) {
      res.setHeader("Content-Type", "text/html");
    }
    if(!res.statusCode){
      res.statusCode = 200;
    }
    res.end(data);
  };
  this.status = code => {
    res.statusCode = code;
    return this;
  };
  this.type = type => {
    res.setHeader("Content-Type", type);
    return this;
  };
  this.set = (header, headerkey) => {
    if (typeof header !== "object") {
      res.setHeader(header, headerkey);
    } else {
      for (let key in header) {
        res.setHeader({ key: header[key] });
      }
    }
    return this;
  };
  this.json = body => {
    // set header to match json content
    res.setHeader("Content-Type", "application/json");
    // set status code to match
    if(!res.statusCode){
      res.statusCode = 200;
    }
    // send json
    res.end(JSON.stringify(body));
  };
  this.sendFile = filePath => {
    // use fs to read a file from directory
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      if(!res.statusCode){
        res.statusCode = 200;
      }
      res.end(data);
    });
  };
  this.render = (fileName, user_options) => {
    // create the full options object with both user specified options and express options
    let option = {
      ...user_options,
      settings: options,
    }
    if(options.engine === null){
      throw 'No render engine specified.'
    }
    if(options["view engine"] === "handlebars"){
      // add handle bar extension to file if not specified
      if(!/.handlebars/.test(fileName)){
        fileName = fileName + '.handlebars';
      }
      // use engine specified in options
      options.engine(options.views + "\\" + fileName, option, (err, str) => {
        if(err) throw err;
        if(!res.statusCode){
          res.statusCode = 200;
        }
        this.send(str);
      });
    }
  };
  this.redirect = (path) => {
    // set res status code to redirect
    res.statusCode = 302;
    // set location header to proper path
    this.set('Location', path);
    // send the new header response
    res.end();
  }
}

module.exports = Response;



