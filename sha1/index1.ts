import crypto from "crypto";
/**
 * 左移
 * @param n
 */
function leftrotate(num: number, n: number) {
  return ((num << n) >>> 0) | (num >>> (32 - n));
}

function complement(input: string) {
  const buff = Buffer.from(input, "utf-8");

  const bitLen = buff.length * 8;

  /**
   * 不论如何，都要先补一个1，由于每个字节是8位，新增一个字节1开头转换成10进制则是128
   */
  const diff = bitLen % 512;
  const fill = new Uint8Array(buff.length + (448 - diff) / 8 + 8); // 原始报文长度(buff.length) + 补位长度（(448 - diff) / 8） + 消息长度信息(8)

  fill.set(buff);
  fill.set([128], buff.length);
  fill.set([bitLen], fill.length - 1);

  return fill;
}

const K_Const = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

const H_Const = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

function main(input: string) {
  const compleUint8 = complement(input);
  const h = [...H_Const];

  for (let i = 0; i < compleUint8.length / 64; i++) {
    const block = compleUint8.slice(i * 64, (i + 1) * 64);
    const words = [];
    for (let j = 0; j < 16; j++) {
      const wds = [].map.call(block.slice(j * 4, (j + 1) * 4), (n: number) => n.toString(2).padStart(8, "0")).join("");
      const w = parseInt(wds, 2);
      words.push(w);
    }

    for (let j = 16; j < 80; j++) {
      const wds = (words[j - 3] ^ words[j - 8] ^ words[j - 14] ^ words[j - 16]) >>> 0;
      const w = leftrotate(wds, 1);
      console.log(wds, w)
      words.push(w);
    }

    console.log(words);

    let [a, b, c, d, e] = h;

    for (let j = 0; j < 80; j++) {
      let f = 0,
        k = 0;
      if (j < 20) {
        f = (b & c) | (~b & d);
        k = K_Const[0];
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = K_Const[1];
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = K_Const[2];
      } else if (j < 80) {
        f = b ^ c ^ d;
        k = K_Const[3];
      }
      const temp = leftrotate(a, 5) + f + e + k + words[j];
      e = d;
      d = c;
      c = leftrotate(b, 30);
      b = a;
      a = temp;
    }

    h[0] += a;
    h[1] += b;
    h[2] += c;
    h[3] += d;
    h[4] += e;
  }

  return h;
}

// const result = main(
//   "da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd80709da39a3ee5e6b4b0d3255bfef95601890afd80709"
// );
const result = main("中华人民共和国");
console.log(result);
console.log(result.map((v) => v.toString(16)).join(" "));
export {};
