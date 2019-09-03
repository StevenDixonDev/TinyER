const http = require('http');
const Router = require('./Router');
const Methods = require('./methods');

function App() {
    this._router = Router();
    this.engine = function(){

    }
    this.set = function(){

    }
    this.use = function(route, ...fn){
        // set default path
        let path = '/';
        // check if user is using just a function with no path
        if(typeof route === 'function'){
            this._router.use(path, route);
        }else{
            fn.forEach(item => {
                this._router.use(route, item);
            });
        }
        // check if fn has .handle to see if a Router was passed
    }
    this.handle = function(req, res, callback){
        callback = callback || function(){
            console.log('end of route');
        }
        this._router.handle(req, res, callback);
    }
    this.listen = function(port, callback){
        http.createServer(this.handle).listen(port);
        callback();
    }
}

// append the 
Methods.forEach(method => {
    App.prototype[method] = function(path, ...fn){
        const route = this._router.route(path);
        route[method].apply(route, ...fn);
        return this;
    }
})

function createApp(){
    let app = new App();
    return app;;
}

module.exports = createApp;