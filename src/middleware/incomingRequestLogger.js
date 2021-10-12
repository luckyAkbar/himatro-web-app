const morgan = require('morgan');

morgan.token('splitter', () => '\x1b[36m----------------------------------------------------------------------------------\x1b[0m\n');
morgan.token('urlOnly', (req) => req.path);
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('query', (req) => JSON.stringify(req.query));
morgan.token('params', (req) => JSON.stringify(req.params));
morgan.token('protocol', (req, res) => req.protocol);

morgan.token('statusColor', (req, res) => {
  const status = (typeof res.headersSent !== 'boolean' ? Boolean(res.header) : res.headersSent) ? res.statusCode : undefined;

  // get status color
  const color = status >= 500 // red
    ? 31 : status >= 400 // yellow
      ? 33 : status >= 300 // cyan
        ? 36 : status >= 200 // green
          ? 32 : 0; // no color

  return `\x1b[${color}m${status}\x1b[0m`;
});

const incomingRequestLogger = morgan(`:splitter\x1b[1m:protocol\x1b[0m \x1b[33m:method\x1b[0m \x1b[36m:urlOnly\x1b[0m :statusColor \x1b[1m:response-time ms || :date[web]\x1b[0m
  length|:res[content-length]
  \x1b[2mparams:params\x1b[0m
  \x1b[2mquery:query\x1b[0m
  \x1b[2mbody:body\x1b[0m
  :referrer
  :remote-addr
  :user-agent
`);

module.exports = { incomingRequestLogger };
