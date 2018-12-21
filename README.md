# Private Blockchain

In this project I created the classes to manage my private blockchain, to be able to persist my blochchain I used LevelDB.

## Web API

The web API uses Express.js framework.

## Start the server

The command used to start the server:

```bash
npm install
node server.js
```

## Endpoints

### GET /block/:blockHeight

Response Format: JSON

Response Body: The block info for the block at the given block height.

### POST /block

Request Format: JSON

Request Body:

```JSON
{
	"body": "Block data goes here..."
}
```

Response Format: JSON

Response Body: The block info for the block just created.
