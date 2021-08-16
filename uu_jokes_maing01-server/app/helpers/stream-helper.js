"use strict";
const { Readable } = require("stream");

/**
 * whole process is in memory, so it is suitable only for small configuration files
 */
class StreamHelper {
  async readableStreamToString(stream) {
    return new Promise((resolve, reject) => {
      let streamData = "";
      stream.on("data", (data) => {
        console.log("data");
        streamData += data;
      });

      stream.on("end", () => {
        try {
          resolve(streamData);
        } catch (e) {
          reject(e);
        }
      });

      stream.on("error", (error) => {
        reject(error);
      });
    });
  }

  async stringToReadableStream(string) {
    let readableStream = new Readable();
    readableStream.push(string);
    readableStream.push(null);

    return readableStream;
  }
}

module.exports = new StreamHelper();
