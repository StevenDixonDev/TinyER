# Tiny ER

This is an attempt to reconstruct the functionality of express.js. I make no guaranty that this will work 100%.

Trying to create a small version of something you are using is a great way to understand it.

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
        - the engine used for render
    - Response
        - is changed to add new functions that wrap http response object
        - send - done
        - status - done
        - type - done
        - set - done
        - json - done
        - sendFile - done
    - Request
        - is changed to add new functions that wrap http request object
        - app is added to request so it can be referenced.

router (Not implemented)

    - Render
        - Allows the user to render views
        - Implemented single engine rendering with express-handlebars
    - templates 
        - Allows use of template engines

## What I learned

Express has a lot of stuff going on under the hood. This was very complex and I can say that I am not sure how everything works.