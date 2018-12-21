const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('./BlockChain.js');
const Block = require('./Block.js');

const app = express();
const port = 8000;

app.use(bodyParser.json());

const blockChain = new BlockChain.Blockchain();

app.get('/block/:blockHeight', (req, res) => {
    blockChain.getBlock(req.params.blockHeight).then(
        block => {
            // The response for the endpoint provides a block object in JSON format.
            res.status(200).json(block);
        },
        error => {
            // Properly handles an error if the height parameter is out of bounds.
            res.status(404).send('Failed to get the block.');
        });
});

app.post('/block', (req, res) => {
    const blockData = req.body.body;
    if (blockData) {
        blockChain.addBlock(new Block.Block(blockData)).then(
            block => {
                // The response for the endpoint is a block object in JSON format.
                res.status(201).json(JSON.parse(block));
            }, error => {
                res.status(500).send('Failed to add the block.')
            })
    } else {
        // Be sure to validate if there is content in the block before creating and adding it to the chain.
        res.status(400).send('No content found in the block data.')
    }
});

app.listen(port, () => console.log(`Server listening on port ${port}!`))
