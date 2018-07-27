# flip-it
card-matching game

## Running out-of-box

Running application is simple:

```
node ./app.js
```

By default the application will listen on port 80, it can be cahnged by setting `PORT` environemnt variable to the desired pont number. e.g.:

```
PORT=8080 node ./app.js
```


## Running in docker container

### Build the image

Dockerfile is included in the repository, so simply:

```
docker build -t flip-it .
```

### Running image

Image built with Dockerfile from the repository will have application listening on port 80. It should be published to the desired host port, e.g.:

```
docker run -it -p 8080:80 flip-it
```

### Automatically running application with Docker

Create a container with `always` restart policy.

```
docker create -p 8080:80 --restart always --name flip-it flip-it:latest
```

Start the container:
```
docker start flip-it
```

## Persisting data

By default application uses in-memory repository implementation. To persist data override `Repo = require('./in-memory-repository')` with your own implementation.
Repository must implmenent following propertyies/methods:

* items -- returns promise that resolves to all items in repository.
* lookup(id) -- returns promise that resolves either to the item with the id requested, or no such item exists in the repository.
* upsert(object) -- Insert or update object in the repository. Returns promise that is resolved once operation has finished.

Furthermore constructor must accept optional parameter defining property name that contains id value of the item. If none specified property name must be assumed to be `id`.






