function viewHex(binary: string) {
  let result = "";

  for (let i = 0; i < binary.length / 8; i++) {
    result += parseInt(binary.substring(i * 8, (i + 1) * 8), 2).toString(16);
    result += (i + 1) % 4 === 0 ? "\n" : " ";
  }
  console.log(result);
}

function complement(input: string) {
  let result = "";
  Buffer.from(input).forEach((value) => {
    const nv = value.toString(2).padStart(8, "0");
    result += nv;
  });

  const originMsgLen = result.length;

  result += "1"; // 不论如何，都要先补一个1

  const diff = result.length % 512;

  result = result.padEnd(result.length + 448 - diff, "0");

  result += originMsgLen.toString(2).padStart(64, "0");

  // viewHex(result); //debug

  return result;
}

function leftRotate(str: string, num: number) {
  const temp = str.slice(0, num);
  return str.slice(num, str.length) + temp;
}

const K_Const = [0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xca62c1d6];

const H_Const = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0];

function main(input: string) {
  const compleByte = complement(input);
  console.log(compleByte.length)
  // for (let i = 0; i < compleByte.length / 512; i++) {
  //   const chunk = compleByte.substring(i * 512, (i + 1) * 512); // 以512分割块
  //   const words: string[] = [];
  //   for (let j = 0; j < 16; j++) {
  //     words.push(chunk.substring(j * 32, (j + 1) * 32));
  //   }

  //   const newWorkds: string[] = [];

  //   for (let j = 16; j < 80; j++) {
  //     // const w = parseInt(words[j - 3], 2) ^ parseInt(words[j - 8], 2) ^ parseInt(words[j - 14], 2) ^ parseInt(words[j - 16], 2); // 填充字计算
  //     const w = (parseInt(words[j - 3], 2) ^ parseInt(words[j - 8], 2) ^ parseInt(words[j - 14], 2) ^ parseInt(words[j - 16], 2)) >>> 0; // 填充字计算
  //     console.log("w", w);
  //     const w32 = w.toString(2).padStart(32, "0");
  //     // words.push(leftRotate(w.toString(2).padStart(32, "0"), 1)); // 左旋转1得到最终结果后push
  //     const left = w32[0];
  //     console.log(w32.slice(1, w32.length) + left);
  //     words.push(w32.slice(1, w32.length) + left);
  //   }

  //   console.log(words.concat(newWorkds));
  // }
}

main("abc");

export {};