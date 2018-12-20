/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    async generateGenesisBlock() {
        const blockHeight = await this.getBlockHeight();
        if (blockHeight === -1) {
            const genesisBlock = new Block.Block();
            this.addBlock(genesisBlock);
        }
    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    async getBlockHeight() {
        const blocksCount = await this.bd.getBlocksCount();
        return blocksCount - 1;
    }

    // Add new block
    async addBlock(block) {
        const blockHeight = await this.getBlockHeight();
        // Additionally, when adding a new block to the chain, code checks if a Genesis block already
        // exists. If not, one is created before adding the a block.
        if (blockHeight === -1) {
            console.log('Generating genesis block...');
            const genesisBlock = new Block.Block('Genesis Block');
            genesisBlock.time = new Date().getTime();
            genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();
            return await this.bd.addLevelDBData(genesisBlock.height, JSON.stringify(genesisBlock));
        }
        block.height = blockHeight + 1;
        const previousBlock = await this.getBlock(blockHeight);
        block.previousBlockHash = previousBlock.hash;
        block.time = new Date().getTime();
        block.hash = SHA256(JSON.stringify(block)).toString();
        return await this.bd.addLevelDBData(block.height, JSON.stringify(block));
    }

    // Get Block By Height
    async getBlock(height) {
        return await this.bd.getLevelDBData(height);
    }

    // Validate if Block is being tampered by Block Height
    async validateBlock(height) {
        const block = await this.getBlock(height);
        const blockClone = Object.assign({}, block, { hash: '' });
        const expectedBlockHash = SHA256(JSON.stringify(blockClone)).toString();
        return await (block.hash === expectedBlockHash);
    }

    // Validate Blockchain
    async validateChain() {
        let i = 0;
        let errorLog = [];
        let blockHeight = await this.getBlockHeight();
        let previousBlockHash = '';
        while (i <= blockHeight) {
            const isBlockValid = await this.validateBlock(i);
            if (!isBlockValid) {
                errorLog.push(`Block ${i}'s hash is not valid.`);
            }
            const block = await this.getBlock(i);
            if (block.previousBlockHash !== previousBlockHash) {
                errorLog.push(`Block ${i}'s previous block hash is not valid.`);
            }
            previousBlockHash = block.hash;
            i++;
        }
        return errorLog;
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => { console.log(err); reject(err) });
        });
    }

}

module.exports.Blockchain = Blockchain;
