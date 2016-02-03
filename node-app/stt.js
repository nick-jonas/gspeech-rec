/*

  stt.js
  A module that records speech and outputs text
  written by Nick Jonas

  @provider:String can be google, wit, or none.  If none, a recording is saved 
  to the file system and referenced instead of piped to 3rd party API

*/
var Stt = function(provider){
  this.provider = provider;
};

Stt.prototype.start = function() {
  // body...
};

module.exports = Stt;
