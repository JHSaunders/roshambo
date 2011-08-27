var ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
var BASE = 62;

exports.encode = function(num) {
  var str = "";
  do {
    var m = num % BASE;
    num = Math.floor(num / BASE);
    str = ALPHABET[m] + str;
  } while (num > 0);
  return str;
};

exports.decode = function(string) {
  var len = string.length;
  var num = 0;
  for (i = 0; i < len; i++) {
    var power = len - (i + 1);
    num = num + ALPHABET.indexOf(string[i]) * Math.pow(BASE, power);
  };
  return num;
};

// vi: set et sta sw=2 ts=2:
