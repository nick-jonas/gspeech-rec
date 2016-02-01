var google_speech = require('google-speech');

google_speech.ASR({
    developer_key: 'AIzaSyAbx9tR74Gh-pDTy_gsbsdt-s_pX5jK0ik',
    file: 'data/sample.wav',
    lang: 'en-US'
  }, function(err, httpResponse, result){
    if(err){
        console.log(err);
      }else{
        console.log(httpResponse.statusCode, result);
        // parse result
        var result = '{"result":[{"alternative":[{"transcript":"testing testing hello 123 hello testing"},{"transcript":"testing testing hello 1 2 3 hello testing"},{"transcript":"testing testing hello 1 2 3 hello texting"},{"transcript":"testing testing hello 1 2 3a hello testing"}],"final":true}],"result_index":0}';
        result = result.match(/transcript.*}/)[0];
        result = '"' + result;
        result = result.match(/"((?:\\.|[^"\\])*)"/g)[1].replace(/"/g, ''));
        
      }
    }
);


