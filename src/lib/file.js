/* eslint no-underscore-dangle: 0 */
const fs = require('fs');
const path = require('path');
const marked = require('marked');
const yaml = require('js-yaml');
const hfm = require('hexo-front-matter');

function parseMarkdown(fileContent) {
  // markdown file with `hexo-front-matter`
  // https://github.com/hexojs/hexo-front-matter
  const ctx = hfm(fileContent);
  // parse markdown
  ctx.content = marked(ctx._content);
  return ctx;
}

function parseYMAL(fileContent) {
  try {
    return yaml.safeLoad(fileContent);
  } catch (e) {
    console.warn(e);
    return {};
  }
}

/**
 * Source File
 */
export default class File {
  constructor(src) {
    this.fullpath = src;
    this.ext = path.parse(src).ext;

    const state = fs.statSync(src);
    if (state.isFile()) {
      const fileContent = fs.readFileSync(src, 'utf8');
      let ctx;
      // parse file content
      switch (this.ext) {
        case '.md':
        case '.markdown':
        case '.mdown':
        case '.mkd':
        case '.mkdown':
          ctx = parseMarkdown(fileContent);
          break;
        case '.yaml':
          ctx = parseYMAL(fileContent);
          break;
        default:
          ctx = {};
      }
      this.ctx = ctx;
    }
  }
  // toObject() {
  //   return {
  //     data: this.data,
  //     content: this.content,
  //   };
  // }
}
