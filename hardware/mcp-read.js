var rpio = require('rpio');

rpio.spiBegin();

// Prepare TX buffer [trigger byte = 0x01] [channel 0 = 0x80 (128)] [dummy data = 0x01]
var sendBuffer = new Buffer([0x01, (8 + 0 << 4), 0x01]); 

// Send TX buffer to SPI MOSI and recieve RX buffer from MISO
var recieveBuffer = rpio.spiTransfer(sendBuffer, sendBuffer.length); 

// Extract value from output buffer. Ignore first byte (junk). 
var junk = recieveBuffer[0],
    MSB = recieveBuffer[1],
    LSB = recieveBuffer[2];

// Ignore first six bits of MSB, bit shift MSB 8 positions and 
// lastly combine LSB with MSB to get a full 10 bit value
var value = ((MSB & 3) << 8) + LSB; 

console.log('ch((sendBuffer[1] >> 4) - 8), '=', value);