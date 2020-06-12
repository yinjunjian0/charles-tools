#! /usr/bin/env node
const App = require('yargs')
const build = require('../lib/build')
const start = require('../lib/start')
const path = require('path')

App
  // .option('baseDir', {
  //   default: process.cwd(),
  //   describe: 'App base dir path. (Relative path of cwd)'
  // })
  .option('staticDir', {
    default: path.resolve(process.cwd(), 'dist'),
  })
  .command('build', 'build !!!', {
  }, build)
  .command('start', 'Start !!!', {
    port: {
      default: 8080,
    }
  }, start)
  .argv

