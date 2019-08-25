# Tiny ER

This is an attempt to reconstruct the functionality of express.js

Trying to create a small version of something you are using is a great way to understand it.

## What does express do?

Express allows a user to create a server using node.js, In theory express wraps http and extends its functionality.

## The bits and pieces

Dividing Express into parts should make it easier to replicate

- app: serves as the starting point for express, normal use is app = express() where express is a singleton that creates an app.
    - get
    - post
    - use
- router - tba
- middleware - allows the user to define intermediary functions that run at defined routes or on all routes.
- templates - tba

## What I learned