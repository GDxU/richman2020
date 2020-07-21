import lzma from "lzma";

function decode (input) {
//  console.log(input);
  return new Promise (function (resolve, reject) {
    let LZMA = lzma.LZMA;
    let lzmaWorker = new LZMA ();
    let lzmaInput = decodeURIComponent (input);
    let lzmaBuffer = new Buffer (lzmaInput, "base64")
      .toString ("binary")
      .split ("")
      .map (function (c) {
        return c.charCodeAt (0) - 128
      });

    lzmaWorker.decompress (lzmaBuffer, function (result) {
      resolve (JSON.parse (result, null, 4));
    });
  });
}

function encode (input) {
  return new Promise (function (resolve, reject) {
    let LZMA = lzma.LZMA;
    let lzmaWorker = new LZMA ();
    //let lzmaInput = decodeURIComponent (input);
    let lzmaBuffer = new Buffer (lzmaInput, "base64")
      .toString ("binary")
      .split ("")
      .map (function (c) {
        return c.charCodeAt (0) - 128
      });

    lzmaWorker.compress (lzmaBuffer, 8, function (result) {
      resolve (JSON.parse (result, null, 4));
    }, function (result) {
      //  resolve (JSON.parse (result, null, 4));
    });
  });
}

const LZMA = {
  decode,
  encode,
};

export default LZMA;
