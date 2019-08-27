const fs = require("fs");

function Response(res, options) {
  this.send = data => {
    if (typeof data === "string") {
      res.setHeader("Content-Type", "text/html");
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
    this.send(body);
  };
  this.sendFile = filePath => {
    fs.readFile(filePath, (err, data) => {
      if (err) throw err;
      res.end(data);
    });
  };
  this.render = (file, opt, callback) => {
    options.engine(__dirname + file + ".handlebars", opt, data => {
      console.log(data);
    });
  };
}

module.exports = Response;
