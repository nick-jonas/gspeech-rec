var raspi = require('raspi-io');
var five = require('johnny-five');
var board = new five.Board({
  io: new raspi()
});
var lcd;



board.on('ready', function(){
  lcd = new five.LCD({
    // LCD pin name  RS  EN  DB4 DB5 DB6 DB7
    pins: ['GPIO12', 'GPIO21', 'GPIO5', 'GPIO6', 'GPIO17', 'GPIO18'],
    backlight: 6,
    rows: 2,
    cols: 16
    // Options:
    // bitMode: 4 or 8, defaults to 4
    // lines: number of lines, defaults to 2
    // dots: matrix dimensions, defaults to "5x8"
  });

  lcd.clear();
  lcd.cursor(0, 0).print("-> English");
  lcd.cursor(1, 5).print("Spanish ->");

  this.repl.inject({
    lcd: lcd
  });
});

var showTranslation = function(text){
  lcd.clear();
  lcd.autoscroll();
  lcd.cursor(0, 0).print(text);
}

// blinks 3 dots
var thinkInterval;
function startThinking(){
  var dotCount = 3;
  var currIndex = 0;
  var startPosition = 7;
  thinkInterval = setInterval(function(){
    lcd.clear();
    if(currIndex === dotCount){
      currIndex = 0;
    }
    lcd.cursor(0, startPosition + currIndex);
    lcd.print('.');
    currIndex++;
  }, 300);
}

function stopThinking(){
  clearInterval(thinkInterval);
}