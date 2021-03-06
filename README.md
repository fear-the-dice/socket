[![GitHub tag](https://img.shields.io/github/tag/fear-the-dice/socket.svg)](https://github.com/fear-the-dice/socket/tags)
[![GitHub issues](https://img.shields.io/github/issues/fear-the-dice/socket.svg)](https://github.com/fear-the-dice/socket/issues)
[![Coverage Status](https://coveralls.io/repos/fear-the-dice/socket/badge.svg)](https://coveralls.io/r/fear-the-dice/socket)
[![Codacy Badge](https://www.codacy.com/project/badge/4c683cf114b848b3a6b1e9224e14c05a)](https://www.codacy.com/app/jeffhann/fear-the-dice-socket)
[![Build Status](https://travis-ci.org/fear-the-dice/socket.svg)](https://travis-ci.org/fear-the-dice/socket)
[![Dependency Status](https://david-dm.org/fear-the-dice/socket.svg)](https://david-dm.org/fear-the-dice/socket)
[![node](https://img.shields.io/node/v/gh-badges.svg)](https://nodejs.org/)
[![GitHub license](https://img.shields.io/github/license/fear-the-dice/socket.svg)]()

#Fear the Dice
A tool for helping manage combat in a turn based environment. Allowing DM's/GM's to control stats such as AC, HP, and damage taken for a group.


##Socket Server
For our socket server we use Socket.io. When running the server can be accessed on port 1347.

* **Installation:**
    > This is simple since its already part of our NPM package.

    ```
    $ npm install
    ```
* ***Use:***

    ```
    $ node index.js
    ```
* ***Testing:***
    > We use [Mocha](http://mochajs.org/) for testing and [Istanbul](https://gotwarlost.github.io/istanbul/) for code coverage. 

    ```
    $ npm run test
    ```

##License
This tool is protected by the [GNU General Public License v2](http://www.gnu.org/licenses/gpl-2.0.html).

Copyright [Jeffrey Hann](http://jeffreyhann.ca/) 2015
