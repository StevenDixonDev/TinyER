# Tiny ER

This is an attempt to reconstruct the functionality of express.js

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
        - middleware - allows the user to define intermediary functions that run at defined routes or on all routes.
    - Response
        - is changed to add new functions that wrap http response object
    - Request
        - is changed to add new functions that wrap http request object

router (Not implemented)

    - Render
        - Allows the user to render views
    - templates 
        - Allows use of template engines

## What I learned

Express has a lot of stuff going on under the hood.