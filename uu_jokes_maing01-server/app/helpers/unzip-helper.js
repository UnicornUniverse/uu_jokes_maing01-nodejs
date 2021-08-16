const unzip = require("unzip-stream");
const pump = require("pump");

class UnzipHelper {
  async unzip(data, callback) {
    await new Promise((resolve, reject) => {
      let unzipStream = pump(data, unzip.Parse());
      let entryPromise;

      unzipStream.on("entry", async (entry) => {
        entryPromise = new Promise(async (resolve) => {
          try {
            unzipStream.pause();
            entryPromise = await callback(entry);
            unzipStream.resume();
            resolve();
          } catch (e) {
            unzipStream.destroy(e);
          }
        });
      });

      unzipStream.on("error", (e) => {
        reject(e);
      });

      unzipStream.on("end", async () => {
        if (entryPromise) {
          await entryPromise;
        }
        resolve();
      });
    });
  }
}

module.exports = new UnzipHelper();
