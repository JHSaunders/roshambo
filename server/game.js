MIN_NUMBER = 916132832;
MAX_NUMBER = 56800235583;

var base62 = require('./base62');
var format = require('./format');
var static_ = require('./static');
var games  = exports.games = {};


var Game = function() {
  this.nonces = [];
  this.p1 = "";
  this.p2 = "";
  this.p1response = null;
  this.p2response = null;
};

Game.prototype = {
  addNonce: function(nonce) {
    if (this.nonces.length < 2) {
      this.nonces.push(nonce);
    }
  },
  wait: function(nonce, response) {
    if (nonce == this.nonces[0]) {
      this.p1response = response;
    }
    if (this.nonces.length == 2) {
      if (nonce == this.nonces[1]) {
        this.p2response = response;
      }
      if (this.p1response && this.p2response) {
        this.p1response.write('true');
        this.p1response.end();
        this.p1response = null;
        this.p2response.write('true');
        this.p2response.end();
        this.p2response = null;
      }
    }
  },
  play: function(nonce, response) {
    if (this.nonces.length == 2) {
      if (nonce == this.nonces[0]) {
        this.p1response = response;
      }
      if (nonce == this.nonces[1]) {
        this.p2response = response;
      }
      if (this.p1response && this.p2response) {
        this.p1response.write(this.compete());
        this.p1response.end();
        this.p1response = null;
        this.p2response.write(this.compete());
        this.p2response.end();
        this.p2response = null;
      }
    }
  },
  isReady: function() {
    return this.nonces.length == 2; 
  },
  isCompleted: function() {
    return (this.p1.length > 0 && this.p2.length > 0);
  },
  compete: function(a, b) {
    if (a === b) {
      return "draw";
    }
    if (a === "rock" && b === "scissors") {
      return "won";
    }
    if (a === "paper" && b === "rock") {
      return "won";
    }
    if (a === "scissors" && b === "paper") {
      return "won";
    }
    return "loose";
  },
  getResult: function(nonce) {
    var you = "";
    var opponent = "";
    if (nonce == this.nonces[0]) {
      you = this.p1;
      opponent = this.p2;
    } else {
      you = this.p2;
      opponent = this.p2;
    }
    var result = {
      you: you,
      opponent: opponent,
      result: compete(you, opponent),
    };
    return result;
  },
};

function createNonce() {
  return base62.encode(new Date().getTime());
}

exports.index = function(response, postData, cookies) {
  var key = "";
  do {
    var num = MIN_NUMBER + (Math.random() * ((MAX_NUMBER - MIN_NUMBER) + 1));
    key = base62.encode(Math.floor(num));
  } while (key in games);
  games[key] = new Game();
  format.serveTemplated(response, "index.html", key);
};

exports.gamePage = function(response, postData, cookies, name) {
  if (name in games) {
    var game = games[name];
    if (game.nonces.length < 2) {
      var n = createNonce();
      game.addNonce(n);
      response.setHeader('Set-Cookie', 'nonce=' + n);
      format.serveTemplated(response, "game.html")
    }
  }
  //TODO: Error handling
};

exports.wait = function(response, postData, cookies, name) {
  //TODO timeout
  var n = cookies['nonce'];
  if (typeof(n) != "undefined") {
    return games[name].wait(n, response);
  }
  static_.errorResponse(response);
};

exports.play = function(response, postData, cookies, name) {
  var n = cookies['nonce'];
  if (typeof(n) != "undefined" && games[name].nonces.length === 2) {
    return games[name].play(n, response);
  }
  static_.errorResponse(response);
};

// vi: set et sta sw=2 ts=2:
