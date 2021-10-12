const morgan = require('morgan');

morgan.token('urlOnly', (req) => req.path);

morgan.token('body', (req) => JSON.stringify(req.body));

morgan.token('query', (req) => JSON.stringify(req.query));

morgan.token('params', (req) => JSON.stringify(req.params));

morgan.token('splitter', () => '\x1b[36m----------------------------------------------------------------------------------\x1b[0m\n');

morgan.token('statusColor', (req, res) => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent) ?
    res.statusCode: undefined;

  // get status color
  const color = status >= 500 ? 31 // red
    : status >= 400 ? 33 // yellow
    : status >= 300 ? 36 // cyan
    : status >= 200 ? 32 // green
    : 0; // no color

  return '\x1b[' + color + 'm' + status + '\x1b[0m';
});

const incomingRequestLogger = morgan(`:splitter\x1b[33m:method\x1b[0m \x1b[36m:urlOnly\x1b[0m :statusColor \x1b[1m:response-time ms || :date[web]\x1b[0m
  length|:res[content-length]
  \x1b[2mbody:body\x1b[0m
  \x1b[2mquery:query\x1b[0m
  \x1b[2mparams:params\x1b[0m
  :referrer
  :remote-addr
  :user-agent
`);

module.exports = { incomingRequestLogger };
