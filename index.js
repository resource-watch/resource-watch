
// Load environment variables from .env file if present
var dotenv = require('dotenv');
dotenv.load();

const { createServer } = require('http');
const next = require('next');
const routes = require('./routes');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handler = routes.getRequestHandler(app);

app.prepare()
.then(() => {
  createServer(handler)
  .listen(9000, err => {
    if (err) {
      throw err;
    }
    console.log('> Ready on http://localhost:9000');
  });
});
