const Module1 = require('./module1')
const Module2 = require('./module2')
const DistConfig = require('../../index.js')
const myConfig = new DistConfig({ config_dirs: './', silent: false })
myConfig.load()
// inject loaded configuration in loaded modules
console.log(myConfig.store())
const mod1 = new Module1(myConfig.get('module1'))
const mod2 = new Module2(myConfig.get('module2'))

console.log('Module 1: ', mod1.getValue)
console.log('Module 2: ', mod2.getValue)
