const Client = require("ssh2-sftp-client");
const webpackBuild = require('./build')

const sftp = new Client();
const fs = require("fs");
const path = require('path')


const config = {
  host: "39.106.122.4",
  user: "root",
  password: "aB287712",
  port: "22",
};

module.exports = async function ({ staticDir, app }) {
  await webpackBuild({ staticDir })

  const version = +new Date()
  const remoteFile = `/usr/local/Hisoka/project/${app}/${version}`

  console.log(`项目名：${app}`);
  console.log(`版本：${version}`);
  console.log('--------开始部署---------');

  sftp
    .connect(config)
    .then(() => {
      return sftp.uploadDir(staticDir, remoteFile);
    })
    .then((data) => {
      console.log(data);
      console.log('--------部署完成--------');
      process.exit(1)
      return
    })
    .catch((err) => {
      throw err;
    });
}