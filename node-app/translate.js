var rp    = require('request-promise'),
    qs    = require('querystring');

var GOOGLE_KEY = 'AIzaSyAUpnxV2S7nNAlIo9sZnJBVligAJBzMWc0';

exports.translate = function(body, outLanguage){
  var params = {};
  params['key'] = GOOGLE_KEY;
  params['target'] = outLanguage;
  params['q'] = body;
  
  return rp({
    method: 'GET',
    uri: 'https://www.googleapis.com/language/translate/v2?' + qs.stringify(params)
  }).then(parseResult);
  
};

var parseResult = function (body){
  body = JSON.parse(body);
  var translations = body.data.translations, result;
  if(translations.length > 0){
    // let's take the first translation
    result = translations[0].translatedText;
    if(translations.length > 1){
      console.log('Returned with multiple translations:');
      console.log(body);
    }else{
      console.log('Translated: ' + result);
    }
    return result;
  }else{
    console.log('Did not return with any translations:');
    console.log(body);
    return 'No translation';
  }
}