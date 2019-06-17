const http = require("http");
const port = 3000;

const requestHandler = (request, response) => {
  console.log(request.url);
  if (request.url == "/time") {
    const interval = setInterval(() => {
      run();
    }, 2000);
    setTimeout(() => {
      clearInterval(interval);
      response.end(new Date().toUTCString());
    }, 5000);
  }
  //   response.end("Go to /time page");

  //   run();

  //   getDT(4000);
  // var UTCstring = (new Date()).toUTCString();
  // console.log('UTCstring', UTCstring);
};

const server = http.createServer(requestHandler);

server.listen(port, err => {
  if (err) {
    return console.log("Something bad happend", err);
  }
  console.log(`server is listening on ${port}`);
});

function delay() {
  // return await for better async stack trace support in case of errors.
  return new Promise(resolve => resolve(new Date().toUTCString()));
}

let run = async () => {
  const r = await delay();
  console.log(r);
};
