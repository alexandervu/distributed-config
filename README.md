# Configure your Node.js Applications

[![Build Status](https://travis-ci.org/alexanderVu/distributed-config.svg?branch=master)](https://travis-ci.org/alexanderVu/distributed-config)
[![codecov](https://codecov.io/gh/alexanderVu/distributed-config/branch/master/graph/badge.svg)](https://codecov.io/gh/alexanderVu/distributed-config)

[![js-standard-style](https://cdn.rawgit.com/standard/standard/master/badge.svg)](http://standardjs.com)

**Package is under developement**
## Introduction
This package is writen for systems which have a need of  distributed configuration files. This can be of reason system requirements or even of readability or easier organisation of configuration files. 
It will load all distributed files, independent of file format or path, but depending on set entvironment or machine name and override config settings with environment variables, when defined.

## Quick Start

```shell
$ npm install dist-config
$ vi default.json
```

```js
const DistConf = require('dist-config')
const distconf = new DistConf({ config_dirs: './path_to_your_app'})
const myConfiguration = distconf.load()

module.exports = myConfiguration
```

## Singleton
Unlike other configuration modules, we will not create a singleton, so every new implementation will create new instance.
If you like to have it single time like a singleton in your node application, just move the initialisation to a file and require where you need it.

File config.js
```js 
// file: config.js
// initialise config

const DistConf = require('dist-config')
const distconf = new DistConf({ config_dirs: './path_to_your_app'})
const myConfiguration = distconf.load()

module.exports = myConfiguration
```
File index.js
```js
// file: index.js
// require initialised config

const myConfig = require('./config')


```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019-present, Alexander Vu
