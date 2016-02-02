var Lcd = require('lcd'),
  fs = require('fs'),
  lang = require('./lang');

var Screen = function(options){
  this.currInputIndex = 0;
  this.currOutputIndex = 0;

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
  var langNames = Object.keys(lang.options);
  // show input language
  this.lcd.setCursor(0,0);
  console.log('printing: ')
  console.log('->' + langNames[this.currInputIndex]);
  this.lcd.print('->' + langNames[this.currInputIndex]);

  this.lcd.once('printed', function(){
    // show output language
    this.lcd.setCursor(0,1);
    console.log('printing: ')
    console.log(langNames[this.currOutputIndex] + '->');
    this.lcd.print(langNames[this.currOutputIndex] + '->');
    this.lcd.once('printed', function(){
      this.lcd.clear();
      this.lcd.close();
    });
  });





};

module.exports = Screen;