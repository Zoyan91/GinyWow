const fs = require('fs');

// Create a simple 300x300 PNG image (blue background)
const width = 300;
const height = 300;

// PNG header
const png = Buffer.alloc(8);
png.writeUInt32BE(0x89504E47, 0);
png.writeUInt32BE(0x0D0A1A0A, 4);

// IHDR chunk 
const ihdr = Buffer.alloc(25);
ihdr.writeUInt32BE(13, 0); // Length
ihdr.write('IHDR', 4);
ihdr.writeUInt32BE(width, 8);
ihdr.writeUInt32BE(height, 12);
ihdr.writeUInt8(8, 16); // Bit depth
ihdr.writeUInt8(2, 17); // Color type (RGB)
ihdr.writeUInt8(0, 18); // Compression
ihdr.writeUInt8(0, 19); // Filter
ihdr.writeUInt8(0, 20); // Interlace
ihdr.writeUInt32BE(0x68E5DB85, 21); // CRC

// Simple IDAT chunk with blue pixel data
const pixelData = Buffer.alloc(width * height * 3);
for (let i = 0; i < pixelData.length; i += 3) {
  pixelData[i] = 0x66;     // R
  pixelData[i + 1] = 0x99; // G  
  pixelData[i + 2] = 0xFF; // B
}

// Compress with zlib header
const zlib = require('zlib');
const compressed = zlib.deflateSync(pixelData);

const idat = Buffer.alloc(12 + compressed.length);
idat.writeUInt32BE(compressed.length, 0);
idat.write('IDAT', 4);
compressed.copy(idat, 8);

// Calculate CRC for IDAT
const crc = require('crc-32');
const idatCrc = crc.buf(idat.slice(4, 8 + compressed.length));
idat.writeUInt32BE(idatCrc >>> 0, 8 + compressed.length);

// IEND chunk
const iend = Buffer.alloc(12);
iend.writeUInt32BE(0, 0);
iend.write('IEND', 4);
iend.writeUInt32BE(0xAE426082, 8);

// Write complete PNG
const finalPng = Buffer.concat([png, ihdr, idat, iend]);
fs.writeFileSync('tests/fixtures/test-thumbnail-proper.png', finalPng);
console.log('Created test image: tests/fixtures/test-thumbnail-proper.png');
