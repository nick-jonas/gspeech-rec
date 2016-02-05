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

  // // Tell the LCD you will use these characters:
  // lcd.useChar("check");
  // lcd.useChar("heart");
  // lcd.useChar("duck");

  // // Line 1: Hi rmurphey & hgstrp!
  // lcd.clear().print("rmurphey, hgstrp");
  // lcd.cursor(1, 0);

  // // Line 2: I <3 johnny-five
  // // lcd.print("I").write(7).print(" johnny-five");
  // // can now be written as:
  // lcd.print("I :heart: johnny-five");

  // this.wait(3000, function() {
  //   lcd.clear().cursor(0, 0).print("I :check::heart: 2 :duck: :)");
  // });

  lcd.clear();
  lcd.cursor(0, 0).print("-> English");
  lcd.cursor(1, 5).print("Spanish ->");

  this.repl.inject({
    lcd: lcd
  });
});

var showTranslation(text){
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
  }, 1000);
}

function stopThinking(){
  clearInterval(thinkInterval);
}