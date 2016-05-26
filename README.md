# Replay

A backend app for the Replay project

## Features
* Customer model
    + List all customers
    + Create a new customer
    + Show certain customer
* User model
* Authentication
    + Google Oauth 2.0

## Installation
Install sails globally
```
sudo npm -g install sails
```
On Windows (or Mac OS with Homebrew), you don't need sudo:
```
npm -g install sails
```
Clone the repository
```
git clone git@github.com:linnovate/replay.git
```
Go to app dir
```
cd replay
```
Do regular installation
```
npm install
```

## Configuration
* No configuration needed

## Usage
Run the app
```
sails lift
```
Go to
```
http://localhost:1337
```

## Swagger
go to http://localhost:1337/swagger/ui


## Authentication

### Google Oauth 2.0
Google Oauth credentials and some logic stored in `config/passport.js'

#### Login
Go to
```
/auth/login
```
Walk over the auth process
Go to see that you are logged-in:
```
/user/me
```
####  Logout
```
/auth/logout
```

Note! Policies are not implemented

## Some tips
For live-coding we recommend to use nodemon
```
sudo npm install -g nodemon
```
on Windows or Mac OS
```
npm install -g nodemon
```
Afterwords, you do not need to run `sails lift` but just `nodemon`

- just a test by lior
