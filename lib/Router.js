const Methods = require('./methods');
// Support a limited number of http methods for this demo

function Route(path) {
    // each route has a stack of layers
    this.stack = [];
    // set the path when its created
    this.path = path;
    // the methods the route supports
    this.methods = {};
    // each route has a handle function
    this.handle = function (req, res, next) {

    }
    this.dispatch = function () {

    }
}

Methods.forEach(method => {
    Route.prototype[method] = function (path, ...fn) {

    }
})


function Layer(path, options, fn) {
    this.handle = fn;
    this.path = null;
    // method type is set when App[method] or Router.method is called 
    this.method = null;
    this.handle_req = function (req, res, next) {
        this.handle(req, res, next);
    }
    this.match = function () {

    }
}

function Router() {
    // stack of layers
    this.stack = [];
    // handles processing routes
    this.handle = function (req, res, out) {
        // next is defined here and passed into a layer
    }
    // adds layers to stack
    this.use = function (path, ...fn) {
        //check if path is a function
        if (typeof path === 'function') {
            fn = [path];
            path = '/';
        }
        if(fn.length === 0){
            throw 'Must have a callback for use()';
        }
        fn.forEach(item => {
            const layer = new Layer(path, {}, fn);

            layer.route = undefined;

            this.stack.push(layer);
        });
        return this;
    }
    this.route = function (path) {
        let route = new Route(path);
        let layer = new Layer(path, {}, route.handle.bind(route));
        layer.route = route;
        this.stack.push(layer);
        return route;
    }
}

methods.forEach(method => {
    Router.prototype[method] = function (path, ...fn) {
        let route = this.route(path);
        route[method].apply(route, fn);
        return this;
    }
});

function CreateRouter(options) {
    const router = new Router();
    return router;
}


module.exports = CreateRouter;
