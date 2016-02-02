var fs = require('fs'),
  lang = require('./lang');

var Screen = function(options){
  var Lcd = require('lcd');

  this.currInputIndex = 0;
  this.currOutputIndex = 0;
  if(typeof options['language-in'] !== 'undefined'){
    this.currInputIndex = lang.getIndexFromCode(options['language-in']);
  }
  if(typeof options['language-out'] !== 'undefined'){
    this.currOutputIndex = lang.getIndexFromCode(options['language-out']);
  }

  this.lcd = new Lcd({
    rs: 12,
    e: 21,
    data: [5, 6, 17, 18],
    cols: 16,
    rows: 2
  }); // Pi
  this.lcd.on('ready', this.showLanguageOptions.bind(this));
}

Screen.prototype.showLanguageOptions = function() {
  var that = this;
  // show input language
  this.lcd.setCursor(0,0);
  this.lcd.print('-> ' + lang.getNameFromIndex(this.currInputIndex));

  this.lcd.once('printed', function(){
    // show output language
    that.lcd.setCursor(0,1);
    that.lcd.print(lang.getNameFromIndex(this.currOutputIndex) + ' ->');
    that.lcd.once('printed', function(){
      that.lcd.clear();
      that.lcd.close();
    });
  });
};

module.exports = Screen;