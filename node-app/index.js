var program     = require('commander'),
    lang        = require('./lang'),
    Stt         = require('./stt'),
    Tts         = require('./tts'),
    translator  = require('./translate'),
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




var stt = new Stt({
  provider: program.output, 
  onResult: onSpeechToTextResponse, 
  sampleRate: program.sampleRate
});

stt.start(inLanguage);

function onSpeechToTextResponse(result){
  translator.translate(result, outLanguage)
  .then(function(resp){
    console.log(resp);
  });
}




// try{
//   var lcd = new Screen({
//     'language-in': 'en',
//     'language-out': 'es'
//   });
// }catch(e){
//   console.log('Screen does not work on this device.');
// }

