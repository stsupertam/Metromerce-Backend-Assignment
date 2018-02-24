# Metromerce-Backend-Assignment

[![Build Status](https://travis-ci.org/stsupertam/Metromerce-Backend-Assignment.svg?branch=master)](https://travis-ci.org/stsupertam/Metromerce-Backend-Assignment)

## Pre Requirements
- Node.js
- Yarn
- MongoDB


## Installation

1. install pre requirements

2. clone this project
  ```
  $ git clone https://github.com/stsupertam/Metromerce-Backend-Assignment
  ```

3. install package
  ```
  $ yarn install
  ```
  
4. create ./config/env/development.js (You can see example at ./config/env/example.development.js)
  ```
  $ cp ./config/env/example.development.js ./config/env/development.js
  ```
  
5. start project
  ```
  $ npm start
  ```

## Testing

  ```
  $ npm test
  ```
  
# BlackJackAPI

Service is running on 'http://supertam.xyz'

## Start API

Endpoint for starting game.
* [Start](documents/start.md) : `POST /api/start/`

## Hit API

Endpoint for dealing cards.

* [Hit](documents/hit.md) : `PUT /api/hit/`

### Stand API

Endpoint for calculating score.

* [Stand](documents/stand.md) : `PUT /api/stand/`

### Leaderboard API

Endpoints for viewing top player.

* [Leaderboard](documents/leaderboard.md) : `GET /api/leaderboard/`
