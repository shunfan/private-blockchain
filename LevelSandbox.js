/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    async getLevelDBData(key) {
        let self = this;
        return await new Promise(function (resolve, reject) {
            self.db.get(key, function (err, value) {
                if (err) {
                    console.log('Failed to get levelDB data.');
                    reject(err);
                } else {
                    resolve(JSON.parse(value));
                }
            })
        });
    }

    // Add data to levelDB with key and value (Promise)
    async addLevelDBData(key, value) {
        let self = this;
        return await new Promise(function (resolve, reject) {
            self.db.put(key, value, function (err) {
                if (err) {
                    console.log('Failed to add levelDB data.');
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
    }

    // Method that return the height
    async getBlocksCount() {
        let self = this;
        return await new Promise(function (resolve, reject) {
            let i = 0;
            self.db.createReadStream()
                .on('data', function (data) {
                    i++;
                }).on('error', function (err) {
                    console.log('Failed to get blocks count.');
                    reject(err);
                }).on('end', function () {
                    resolve(i);
                });
        });
    }

}

module.exports.LevelSandbox = LevelSandbox;
