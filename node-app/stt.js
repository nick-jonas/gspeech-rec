/*

  stt.js
  A module that records speech and outputs text
  written by Nick Jonas

  @provider:String can be google, wit, or none.  If none, a recording is saved 
  to the file system and referenced instead of piped to 3rd party API

*/

var request   = require('request'),
  qs          = require('qs'),
  fs          = require('fs'),
  rec         = require('./record'),
  lang        = require('./lang'); 

var WIT_TOKEN = 'JIO3NKSOIXLMGI5TZJ3FJVZDJ2GNRTL2';
var GOOGLE_KEY = 'AIzaSyAUpnxV2S7nNAlIo9sZnJBVligAJBzMWc0';

var sampleRate;
var provider;
var onResultCallback;

/*

options: {
  provider: <string> google|wit|file
  onResult: <fn> returns a string of text
  sampleRate: <n> an integer defining sample rate (i.e. 16000, 44100, 48000)
}

*/
var Stt = function(options){
  sampleRate = options.sampleRate || 16000;
  onResultCallback = options.onResult;
  provider = options.provider || 'google';
};

Stt.prototype.start = function(inLang) {
  var pipedOutput = fileRequest;
  if(provider === 'google'){ pipedOutput = googleRequest; }
  if(provider === 'wit'){ pipedOutput = witRequest; }
  console.log('Starting recording using provider: ' + provider);
  var recording = rec.start({
    sampleRate : sampleRate,
    verbose : true,
    threshold: 3
  })
  .pipe(pipedOutput(inLang));
};


// piped output options
var fileRequest = function(inLang){ return fs.createWriteStream('data/sample.wav', { encoding: 'binary' }); };
var witRequest = function(inLang){ 
  return request.post({
      'url'     : 'https://api.wit.ai/speech?client=chromium&lang=' + inLang + '&output=json',
      'headers' : {
        'Accept'        : 'application/vnd.wit.20160202+json',
        'Authorization' : 'Bearer ' + WIT_TOKEN,
        'Content-Type'  : 'audio/wav'
      }
  }, parseResult);
}
var googleRequest = function(inLang){
  var params = {};
  params['key'] = GOOGLE_KEY;
  params['lang'] = inLang;
  params['output'] = 'json';
  return request.post({
      'url' : 'https://www.google.com/speech-api/v2/recognize?' + qs.stringify(params),
      'headers' : {
        'Content-Type': 'audio/l16; rate=' + sampleRate + ';'
      }
  }, parseResult);
}

var parseResult = function (err, resp, body) {
  var result;
  if(typeof body === 'undefined' || !body || body === ''){
    console.log('Could not capture any audio data. Please set up microphone correctly.');
    console.log(body);
    return;
  }
  // parse output
  if(provider === 'google'){
    // Example Google Response
    // '{"result":[{"alternative":[{"transcript":"testing testing hello 123 hello testing"},{"transcript":"testing testing hello 1 2 3 hello testing"},{"transcript":"testing testing hello 1 2 3 hello texting"},{"transcript":"testing testing hello 1 2 3a hello testing"}],"final":true}],"result_index":0}';
    if(!body.match(/transcript.*}/)){
      console.log('Could not capture any audio data. Please set up microphone correctly.');
      return;
    }
    result = body.match(/transcript.*}/)[0];
    result = '"' + result;
    result = result.match(/"((?:\\.|[^"\\])*)"/g)[1].replace(/"/g, '');
  }else if(provider === 'wit'){
    /* Example Wit.ai response:
      {
        "msg_id" : "9311660f-6810-4616-a0bd-246768a6b515",
        "_text" : "hi testing hello one two",
        "outcomes" : [ {
          "_text" : "hi testing hello one two",
          "confidence" : 0.51,
          "intent" : "test",
          "entities" : { }
        } ]
      }
    */
    result = JSON.parse(body);
    result = result['_text'];
  }else{
    console.log('Your sound file has been saved to data/sample.wav.')
  }

  onResultCallback(result);
}


module.exports = Stt;
