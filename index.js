#!/usr/bin/env node

const { Command } = require('commander');
const superagent = require('superagent');
const program = new Command();

let options = {};

program
  .version('1.0.0')
  .option('-d, --debug', '开启调试')
  .arguments('<url>')
  .description('将 url 转成短网址，使用 https://4m.cn 提供的接口')
  .action((url) => {
    let reg = /((http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?)/;

    if (reg.test(url)) {
      superagent
        .get('https://4m.cn/')
        .then((res1) => {
          let cookie = res1.headers['set-cookie'][0] || '';
          let sessionid = cookie.split(';')[0] || '';

          superagent
            .post('https://4m.cn/shorten')
            .set('Cookie', sessionid)
            .set('Content-Type', 'multipart/form-data')
            .field('url', url)
            .then((res2) => {
              let data;
              
              try {
                data = JSON.parse(res2.text);
              } catch (e) {
                console.log('解析发生错误：', res2);
              }

              if (data.error === 0) {
                console.log('短url：', data.short);
              } else {
                console.log('数据状态发生错误：', res2);
              }
            })
            .catch((err) => {
              options.debug && console.log('请求发生错误：', err);
              console.log('发生错误，请重试');
            })
        })
        .catch((err) => {
          console.log('请求发生错误：', err)
        })
    } else {
      console.log('url格式不正确')
    }
  });

program.parse(process.argv);

options = program.opts();
