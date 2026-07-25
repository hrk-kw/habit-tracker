// アイコンPNGを外部ツール無しで生成するユーティリティ(デザイン変更時は再実行)。
// 実行: node icons/generate-icons.js
'use strict';

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePng(width, height, pixelFn) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    raw[offset] = 0; // フィルタなし
    offset += 1;
    for (let x = 0; x < width; x += 1) {
      const [r, g, b, a] = pixelFn(x, y);
      raw[offset] = r; raw[offset + 1] = g; raw[offset + 2] = b; raw[offset + 3] = a;
      offset += 4;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(raw);

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const BG = [0x1b, 0x1f, 0x24];
const BARS = [
  [0x3e, 0xcf, 0x6e], // green = ジム
  [0xe8, 0xc5, 0x47], // yellow = 自転車
  [0x4a, 0x8f, 0xe8], // accent blue = 家トレ
];

function makeIconPixelFn(size, safeMargin) {
  const barCount = 3;
  const areaSize = size - safeMargin * 2;
  const gap = areaSize * 0.12;
  const barWidth = (areaSize - gap * (barCount - 1)) / barCount;
  const heights = [0.55, 0.85, 0.68].map((h) => h * areaSize);
  const baseline = size - safeMargin;

  const bars = heights.map((h, i) => {
    const x0 = safeMargin + i * (barWidth + gap);
    return { x0, x1: x0 + barWidth, y0: baseline - h, y1: baseline, color: BARS[i] };
  });

  return (x, y) => {
    for (const bar of bars) {
      if (x >= bar.x0 && x < bar.x1 && y >= bar.y0 && y < bar.y1) {
        return [...bar.color, 255];
      }
    }
    return [...BG, 255];
  };
}

function writeIcon(filename, size, safeMarginRatio) {
  const safeMargin = size * safeMarginRatio;
  const png = encodePng(size, size, makeIconPixelFn(size, safeMargin));
  fs.writeFileSync(path.join(__dirname, filename), png);
  console.log(`wrote ${filename} (${size}x${size})`);
}

writeIcon('icon-192.png', 192, 0.18);
writeIcon('icon-512.png', 512, 0.18);
// maskable: OSがマスクで切り抜くため、安全領域を広め(20%)に確保
writeIcon('icon-maskable-512.png', 512, 0.22);
