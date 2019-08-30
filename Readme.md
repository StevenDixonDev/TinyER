# Tiny ER

This is an attempt to reconstruct the functionality of express.js. I make no guaranty that this will work 100%. I also am not trying to make a 1 to 1 replica of express so some functionality is removed.

> Trying to create a small version of something you are using is a great way to understand it.

## What does express do?

Express allows a user to create a server using node.js, In theory express wraps http and extends its functionality.

## The bits and pieces

Dividing Express into parts should make it easier to replicate

app: serves as the starting point for express, normal use is app = express() where express is a singleton that creates an app.
  
    - Get
        - allows response on get request
    - Post
        - allow response on Post request
    - Delete
        - allows response on Delete request
    - Put
        - allows response on Put request
    - Use 
        - allows the user to define intermediary functions that run at defined routes or on all routes.
    - Set 
        - allows the user to specify settings for the app
    - Engine
        - sets the engine used for render
    - Response
        - is changed to add new functions that wrap http response object
        - send - done
        - status - done
        - type - done
        - set - done
        - json - done
        - sendFile - done
        - Render
            - Allows the user to render views
            - Implemented single engine rendering with express-handlebars
    - Request
        - is changed to add new functions that wrap http request object
        - app is added to request so it can be referenced.

router (Not implemented)

    - Route 
        - Each path has its own route and each route has a stack of paths and functions
 


## What I learned

Express has a lot of stuff going on under the hood. This was very complex and I can say that I am not sure how everything works.

#### First attempt

I was able to implement a psuedo version of express however it was missing many of the functions of express. This attempt helped me under stand how express uses engines for rendering and how routes where propagated. 

#### Second attempt 

Armed with new knowledge I set out to implement multiple routing...