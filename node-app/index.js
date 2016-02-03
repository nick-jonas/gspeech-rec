var fs        = require('fs'),
    request   = require('request'),
    qs        = require('querystring'),
    program   = require('commander'),
    exec      = require('child_process').exec,
    lang      = require('./lang'),
    Stt       = require('./stt'),
    Tts       = require('./tts'),
    Screen       = require('./screen');
    
// var WIT_TOKEN = 'JIO3NKSOIXLMGI5TZJ3FJVZDJ2GNRTL2';
// var GOOGLE_KEY = 'AIzaSyAUpnxV2S7nNAlIo9sZnJBVligAJBzMWc0';
// var SAMPLE_RATE = 44100;

var inLanguage = lang.getCodeFromName('English');
var outLanguage = lang.getCodeFromName('Spanish');


// program parameter definition
program
  .version('0.0.1')
  .option('-o --output [value]', 'Output type: google, wit, file')
  .option('-r --sample-rate <n>', 'Sample rate for recording: 16000, 44100, 48000')
  .parse(process.argv);


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
    // tts
    textToSpeech(result);
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


var stt = new Stt({
  provider: program.output, 
  onResult: onSpeechToTextResponse, 
  sampleRate: program.sampleRate
});

stt.start(inLanguage);

function onSpeechToTextResponse(result){
  console.log(result);
}


// try{
//   var lcd = new Screen({
//     'language-in': 'en',
//     'language-out': 'es'
//   });
// }catch(e){
//   console.log('Screen does not work on this device.');
// }

