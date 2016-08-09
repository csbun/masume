import ctxLoader from './ctx_loader';

// const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const inlineSource = require('inline-source');

export default function generate(options, cb) {
  const ctx = ctxLoader(options.entry);
  const templatePath = path.join(__dirname, '../../themes/simple/index.ejs');
  // TODO: 直接 inlineSource(templatePath), 则无法处理其 include 的 template
  inlineSource(templatePath, {
    compress: true,
    rootpath: path.dirname(templatePath),
  }, (err, tpl) => {
    console.log(tpl);
    if (err) {
      cb(err);
    } else {
      try {
        const html = ejs.render(tpl, ctx, {
          filename: templatePath,
        });
        cb(null, html);
      } catch (e) {
        cb(e);
      }
    }
  });
}
