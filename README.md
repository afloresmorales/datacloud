## URL for backend

https://data-clouds.herokuapp.com

Backend is setup with herokuapp where every commit to master automatically triggers the deployment in Heroku.

## Existing endpoints for this service.
- GET /api/value/:key -> for getting a specific value
- GET /api/token -> for getting a token to use.
- POST /api/value -> for creating a value with its key and token.
- For `/api/value` and `/api/value/:key`, you need to pass in the header a token: <token_key> 
- Download Postman and use this collection: https://www.getpostman.com/collections/e664ae9547adb6b7fb47.