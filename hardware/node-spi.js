var SPI = require('spi');

var spi = new SPI.Spi('/dev/spidev0.0', {'mode': SPI.MODE['MODE_0']});

spi.open();

var buf1 = new Buffer(8);
spi.read(buf1, function(device, buf2) {
  var s = "";
  for (var i=0; i < buf.length; i++){
    s = s + buf[i] + " ";
  }
  console.log(s);
});

spi.close();