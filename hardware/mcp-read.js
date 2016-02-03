var rpio = require('rpio');

rpio.spiBegin();
//rpio.spiChipSelect(0);        /* Chip select: use CE0 (default) */
//rpio.spiSetCSPolarity(0, rpio.LOW)  /* Commonly chip enable (CE) pins are active low, and this is the default. */
//rpio.spiSetClockDivider(256)      /* MCP3008 max is ~1MHz, 256 == 0.98MHz */
//rpio.spiSetDataMode(0);

// Prepare TX buffer [trigger byte = 0x01] [channel 0 = 0x80 (128)] [placeholder = 0x01]
var sendBuffer = new Buffer([0x01, (8 + 0 << 4), 0x01]); 

// Send TX buffer to SPI MOSI and recieve RX buffer from MISO
var recieveBuffer = rpio.spiTransfer(sendBuffer, sendBuffer.length); 

// Extract value from output buffer. Ignore first byte. 
var junk = recieveBuffer[0],
  MSB = recieveBuffer[1],
  LSB = recieveBuffer[2];

// Ignore first six bits of MSB, bit shift MSB 8 positions and 
// finally add LSB to MSB to get a full 10 bit value
var value = ((MSB & 3) << 8) + LSB; 

console.log('ch' + ((sendBuffer[1] >> 4) - 8), '=', value);

rpio.spiEnd();