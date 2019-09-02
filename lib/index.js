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
            
        }
        // check if fn has .handle to see if a Router was passed
    }
    this.listen = function(port){

    }
}

// append the 
Methods.forEach(method => {
    App.prototype[method] = function(path, ...fn){

    }
})

function createApp(){
    let app = new App();
    return app;;
}

module.exports = createApp;