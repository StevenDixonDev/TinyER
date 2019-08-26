const http = require("http");
const fs = require("fs");

// return the app that is normally seen in express
function tinyer() {
  function Constructor() {
    // paths that users have provided
    this.paths = [
      {
        route: "",
        fn: [
          (req, res, next) => {
            next();
          }
        ]
      }
    ];
    // function to add a path to paths
    this._addToPath = (route, callback) => {
      let exists = false;
      this.paths.forEach(item => {
        if (item.route === route) {
          item.fn = [callback, ...item.fn];
          exists = true;
        }
      });
      if (exists === false) {
        this.paths.push({ route: route, fn: [callback] });
      }
    };
    // define use to make use of express style use
    this.use = (path, callback = null) => {
      // if first item is a function append it to the route ''
      if (typeof path === "function") {
        this.paths[0].fn.push(path);
      } else {
        // other wise add the item to paths
        this.paths.forEach(item => {
          if (item.route === route) {
            item.fn = [callback, ...item.fn];
          }
        });
      }
    };
    this.get = (route, callback) => {
      this._addToPath(route, callback);
    };
    this.update = (route, callback) => {
      this._addToPath(route, callback);
    };
    this.post = (route, callback) => {
      this._addToPath(route, callback);
    };
    this.delete = (route, callback) => {
      this._addToPath(route, callback);
    };
    // create the http server
    this.listen = (port, callback) => {
      http.createServer(this.mapRequest).listen(port);
      callback();
    };
    // map the request as defined by http
    this.mapRequest = (req, res) => {
      // create a modified response object
      const response = new Response(res);
      stackHandler(req, response, this.paths);
    };
  }
  return new Constructor();
}

module.exports = tinyer;

// create a response object that handles mapping http to express style functions
function Response(res) {
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
}

function stackHandler(req, res, paths) {
  let currentPath = paths.filter(path => path.route === req.url);
  let newStack = [];
  if (currentPath.length === 0) {
    newStack = [...paths[0].fn];
  } else {
    newStack = [...paths[0].fn, ...currentPath[0].fn];
  }
  let index = -1;
  function next() {
    if (index === newStack.length - 1) return;
    index++;
    return newStack[index](req, res, next);
  }
  next();
}
