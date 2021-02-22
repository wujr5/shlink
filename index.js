#!/usr/bin/env node

const { Command } = require('commander');
const superagent = require('superagent');
const program = new Command();
const { parse } = require('node-html-parser');

let options = {};

program
  .version('1.0.0')
  .option('-d, --debug', '开启调试')
  .arguments('<url>')
  .description('将 url 转成短网址，使用 dwz.win，10分钟内6次使用机会')
  .action((url) => {
    let reg = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/;

    if (reg.test(url)) {
      console.log('原url：', url);

      superagent
        .get('http://t.im/?url=' + encodeURIComponent(url))
        .then((res) => {
          let doc = parse(res.text);
          let shortUrlDom = doc.querySelector('#shortUrl');

          if (!shortUrlDom) {
            return console.log('请求太频繁，10s后再试一次');
          }

          console.log('短url：', shortUrlDom.text);
        })
    } else {
      console.log('url格式不正确')
    }
  });

program.parse(process.argv);

options = program.opts();
