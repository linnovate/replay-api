# query-service

Environment variables:

| Name                          | Description                                  | Default        |
|-------------------------------|----------------------------------------------|----------------|
| MONGO_HOST                    | Mongo host URI                               | localhost      |
| MONGO_PORT                    | Mongo port                                   | 27017          |
| MONGO_DATABASE                | Mongo database name                          | replay_dev     |
| ELASTIC_HOST                  | Elastic host URI                             | localhost      |
| ELASTIC_PORT                  | Elastic port                                 | 9200           |
| PORT                          | The port which the service will listen to    | 1338           |

Run with:
```
sails lift
```

Querying examples:
```
GET /videometadata?videoId=578396a5ccb2cf576203fe35
GET /query?limit=10
GET /video?boundingShapeType=polygon&boundingShapeCoordinates=[[[35.527510, 27.105208],[35.524920, 27.106178],[35.525464, 27.109094],[35.527510, 27.105208]]]
```
