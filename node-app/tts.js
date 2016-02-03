/*

  tts.js
  A module that converts input text to speech using Google Services and OMXPlayer
  written by Nick Jonas

  @body: <String> | body of text for the computer to speak
  @options: {
    outputFile: <String> | defaults to /data/out.mp3
    lang: <String> | defaults to 'en'
  }
*/
var google_speech   = require('google-speech'),
    hasbin          = require('hasbin');

exports.speak = function(body, options){
  google_speech.TTS({
      text: body,
      file: options.outputFile || 'data/out.mp3',
      language: options.lang || 'en'
    }, function(){
      console.log('Created data/out.mp3 with text-to-speech.');
      // if omxplayer exists, sound it out
      hasbin('omxplayer', function(result){
        if(result){
          var cmd = 'omxplayer data/out.mp3';
          exec(cmd, function(error, stdout, stderr){
            console.log(stdout);
            setTimeout(startRecording, 2000);
          });
        }else{
          console.log('omxplayer is not installed, will not playback audio.');
          setTimeout(startRecording, 2000);
        }
      });
    }
  );
};