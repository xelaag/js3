const http = require('http');
const dotenv = require('dotenv').;
const port = 3000;
dotenv.config();
const intervalTime = process.env.INTERVAL;
const sendTime = process.env.SENDTIME;

const requestHandler = (request, response) => {
  if (request.url === '/time') {
    const interval = setInterval(() => {
      run();
    }, intervalTime);
    setTimeout(() => {
      clearInterval(interval);
      response.end('Current DateTime is: ' + new Date().toUTCString());
    }, sendTime);
  }
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log('Something bad happend', err);
  }
  console.log(`server is listening on ${port}`);
});

function getUtc () {
  // return await for better async stack trace support in case of errors.
  return new Promise(resolve => resolve(new Date().toUTCString()));
}

async function run () {
  const r = await getUtc();
  console.log(r);
}
