const fs = require("fs");
const path = require("path");

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
    let option = {
      ...opt,
      settings: options,
    }

    //console.log(path.relative(options.views, file))
    //console.log(options.views)
    //console.log(option.settings.views)
    options.engine(options.views + "\\" + file, option, (err, str) => {
      console.log(err)
      this.send(str);
    });
  };
}

module.exports = Response;



