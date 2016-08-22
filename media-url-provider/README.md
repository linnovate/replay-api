# media-url-provider

this project is a microservice designed components which responsible to provide http requests of media source urls.

## Getting Started

clone the repository using git clone <http://git.repo.url>

### Prerequisities

media-url-provider uses sails as its framework. there for you should install sails globaly

```
npm install -g sails
```

### Enviroment variables

media-url-provider requiers a set of environment variables

Set environment variables to config the app:

| Name                          | Description                                  | Default        |
|-------------------------------|----------------------------------------------|----------------|
| MONGO_HOST                    | Mongo host URI                               | localhost      |
| MONGO_PORT                    | Mongo port                                   | 27017          |
| MONGO_DATABASE                | Mongo database name                          | replay_dev     |

### Running

you should use sails init command

```
sails lift
```
running with variables example

```
MONGO_HOST=127.0.0.1 MONGO_PORT=27017 MONGO_DATABASE=replay_dev sails lift.
```

## Running the tests

Tests in this project use Mocha testing framework.

Install Mocha globaly

```
npm isntall -g mocha
```

In order to run tests we use npm test script

```
npm test
```

for code coverage run

```
npm run coverage
```

## Built With

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Yurai** - *Initial work* -

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who's code was used
* Inspiration
* etc
