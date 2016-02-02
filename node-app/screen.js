var Lcd = require('lcd'),
  fs = require('fs'),
  lang = require('./lang');

function Screen(options){
  this.currInputIndex = 0;
  this.currOutputIndex = 0;

  this.lcd = new Lcd({
    rs: 12,
    e: 21,
    data: [5, 6, 17, 18],
    cols: 16,
    rows: 2
  }); // Pi
  this.lcd.on('ready', this.showLanguageOptions);
}

Screen.prototype.showLanguageOptions = function() {
  var langNames = Object.keys(lang.options);

  // show input language
  lcd.setCursor(0,0);
  lcd.print('->' + langNames[this.currInputIndex]);

  lcd.once('printed', function(){
    // show output language
    lcd.setCursor(0,1);
    lcd.print(langNames[this.currOutputIndex] + '->');
    lcd.once('printed', function(){
      lcd.clear();
      lcd.close();
    });
  });





};

module.exports = Screen;