var google_speech = require('google-speech');

google_speech.ASR({
    developer_key: 'AIzaSyAbx9tR74Gh-pDTy_gsbsdt-s_pX5jK0ik',
    file: 'data/sample.wav',
    lang: 'en-US'
  }, function(err, httpResponse, xml){
    if(err){
        console.log(err);
      }else{
        console.log(httpResponse.statusCode, xml)
      }
    }
);