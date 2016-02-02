var rec       = require('node-record-lpcm16'),
    fs        = require('fs'),
    request   = require('request'),
    qs        = require('querystring'),
    program   = require('commander'),
    google_speech = require('google-speech'),
    hasbin    = require('hasbin'),
    exec      = require('child_process').exec,
    lang      = require ('./lang');
    
var WIT_TOKEN = 'JIO3NKSOIXLMGI5TZJ3FJVZDJ2GNRTL2';
var GOOGLE_KEY = 'AIzaSyAUpnxV2S7nNAlIo9sZnJBVligAJBzMWc0';
var SAMPLE_RATE = 44100;

var OUTPUT_TYPES = ['google', 'wit', 'file'];
var outputType = 'file';
var inLanguage = lang.getCodeFromName('English');
var outLanguage = lang.getCodeFromName('Spanish');


// program parameter definition
program
  .version('0.0.1')
  .option('-o --output [value]', 'Output type: ' + OUTPUT_TYPES)
  .option('-r --sample-rate <n>', 'Sample rate for recording: 16000, 44100, 48000')
  .parse(process.argv);

if(program.output){
  if(OUTPUT_TYPES.indexOf(program.output) < 0){
    console.warn('Warning: output type ' + program.output + ' needs to be one of the following: ' + OUTPUT_TYPES);
  }else{
    outputType = program.output;
  }
}
if(program.sampleRate){
  SAMPLE_RATE = program.sampleRate;
}

// piped output options
var fileRequest = function(){ return fs.createWriteStream('data/sample.wav', { encoding: 'binary' }); };
var witRequest = function(){ 
  return request.post({
      'url'     : 'https://api.wit.ai/speech?client=chromium&lang=' + inLanguage + '&output=json',
      'headers' : {
        'Accept'        : 'application/vnd.wit.20160202+json',
        'Authorization' : 'Bearer ' + WIT_TOKEN,
        'Content-Type'  : 'audio/wav'
      }
  }, exports.parseResult);
}
var googleRequest = function(){
  var params = {};
  params['key'] = GOOGLE_KEY;
  params['lang'] = inLanguage;
  params['output'] = 'json';
  return request.post({
      'url' : 'https://www.google.com/speech-api/v2/recognize?' + qs.stringify(params),
      'headers' : {
        'Content-Type': 'audio/l16; rate=16000;'
      }
  }, exports.parseResult);
}



// on press, start recording
var startRecording = function(){
  var pipedOutput = fileRequest;
  if(outputType === 'google'){ pipedOutput = googleRequest; }
  if(outputType === 'wit'){ pipedOutput = witRequest; }

  rec.start({
    sampleRate : SAMPLE_RATE,
    verbose : true,
    threshold: 3
  })
  .pipe(pipedOutput());
}

var translate = function(body){
  var params = {};
  params['key'] = GOOGLE_KEY;
  params['target'] = outLanguage;
  params['q'] = body;
  return request.get({
    'url': 'https://www.googleapis.com/language/translate/v2?' + qs.stringify(params)
  }, onTranslateComplete);

}

var onTranslateComplete = function (err, resp, body){
  if(err){
    console.log(err);
  }
  body = JSON.parse(body);
  var translations = body.data.translations, result;
  if(translations.length > 0){
    // let's take the first translation
    result = translations[0].translatedText;
    // speech to text
    speechToText(result);
    if(translations.length > 1){
      console.log('Returned with multiple translations:');
      console.log(body);
    }else{
      console.log('Translated: ' + result);
    }
  }else{
    console.log('Did not return with any translations:');
    console.log(body);
  }

}

var speechToText = function(body){
  google_speech.TTS({
    text: body,
    file: 'data/out.mp3',
    language: outLanguage
    }, function(){
      console.log('Created data/out.mp3 with text-to-speech.');
      // if omxplayer exists, sound it out
      hasbin('omxplayer', function(result){
        if(result){
          var cmd = 'omxplayer data/out.mp3';
          exec(cmd, function(error, stdout, stderr){
            console.log(stdout);
          });
        }else{
          console.log('omxplayer is not installed, will not playback audio.');
        }
      });      

    }
  );
}

// parse result, dependent on piped output
exports.parseResult = function (err, resp, body) {
  var result;
  console.log(body);
  if(typeof body === 'undefined' || !body || body === ''){
    console.log('Could not capture any audio data. Please set up microphone correctly.');
    return;
  }
  // parse output
  if(outputType === 'google'){
    // Example Google Response
    // '{"result":[{"alternative":[{"transcript":"testing testing hello 123 hello testing"},{"transcript":"testing testing hello 1 2 3 hello testing"},{"transcript":"testing testing hello 1 2 3 hello texting"},{"transcript":"testing testing hello 1 2 3a hello testing"}],"final":true}],"result_index":0}';
    result = body.match(/transcript.*}/)[0];
    result = '"' + result;
    result = result.match(/"((?:\\.|[^"\\])*)"/g)[1].replace(/"/g, '');
  }else if(outputType === 'wit'){
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

  console.log(result);

  // translate
  var translatedText = translate(result);


};

// start recording
startRecording();

