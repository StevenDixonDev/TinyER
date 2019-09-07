const pathToRegexp= require('path-to-regexp');

function Layer(path, fn, opts) {
  // set the layers handle function to the passed function, this can be overwritten in the instance that a route object is set
  this.handle = fn;
  // set the path to the route
  this.path = path;
  // if the path has a route then we know its a http request handler
  this.route = undefined;
  // method is set by route or router
  this.method = undefined;
  // keys defined by regexp function below
  this.keys = [];
  // params defined on match with regexp
  this.params = {};
  // regexp defined to handle the path matching
  this.regexp = pathToRegexp(path, this.keys, opts);
  // function to compare paths and wildcard route as well
  this.match = (p) => {
    if(this.quickRoute){
      this.params = {};
      this.path = '';
      return true
    }
    if(this.path === '*'){
      return true;
    }
    // get the match
    let match = this.regexp.exec(p);
    // if there is no match return false
    if(!match) return false;

    // cut off the first witch is the path
    this.path = match[0];
    let sliced_m = match.slice(1);
    // loop through the keys and match them to the matched items
    this.keys.forEach((key, index) => {
      let prop = key.name;
      if(typeof sliced_m[index] === 'string'){
        this.params[prop] = sliced_m[index];
      }else{
        this.params[prop] = undefined;
      }
    });
    // if everything was successful return true;
    return true;
  };
  // handle req is triggered by layer on requests
  this.handle_req = function (req, res, next) {
    this.handle(req, res, next);
  };
}

module.exports = Layer;