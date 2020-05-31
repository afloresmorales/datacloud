## URL for backend

https://data-clouds.herokuapp.com

Backend is setup with herokuapp where every commit to master automatically triggers the deployment in Heroku.

## Existing endpoints for this service.
- GET /values/:key -> for getting a specific value
- GET /token -> for getting a token to use.
- PUT `/values/:key` -> for creating a value with its key and token.
- For `/values/:key`, you need to pass in the header a token: <token_key> 
- Download Postman and use this collection: https://www.getpostman.com/collections/e664ae9547adb6b7fb47.
# Example: curl for getting token.
```
  curl --request GET https://data-clouds.herokuapp.com/token
```

# Example: curl for inserting a value.
```
  curl -H "Content-Type: text/plain" -H "token: c9a5fc7a-34ba-4213-80de-e79ff98659c8" --request PUT --data "data added here." https://data-clouds.herokuapp.com/values/someKey
```

# Example: curl for getting a value.
  ```
    curl -H "token: c9a5fc7a-34ba-4213-80de-e79ff98659c8" --request GET https://data-clouds.herokuapp.com/values/someKey
  ```
