import generate from './lib/generate';
import loadCtx from './lib/ctx_loader';

const pkg = require('../package.json');

function version() {
  return pkg.version;
}

export {
  loadCtx,
  generate,
  version,
};
