const ip = require("ip");
const opn = require("opn");
const path = require("path");
const chalk = require("chalk");
const express = require("express");
const proxy = require("http-proxy-middleware");

const server = express();
const rootPath = path.resolve();

const uri = `http://${ip.address()}:5010`;
// server.use('/', express.static(path.join(rootPath, 'webapp')))
server.use(
  "/",
  express.static(path.join(rootPath, "webapp")),
  proxy({
    // target: "http://192.168.2.135:8080",
    target: "http://xindaiguanjia-app-prod.itkyd.com",
    changeOrigin: true,
  })
  // http://dev-app-web.itkyd.com //测试式
  // https://dc-app-web.itkyd.com/ //正式
  // proxy({
  //   target: 'http://172.16.8.21:8880',
  //   changeOrigin: true
  // })
);

server.listen(5010, (error) => {
  if (error) {
    throw error;
  }
  // console.log(chalk.green(`Server is running at ${uri}`));
  opn(uri);
});
