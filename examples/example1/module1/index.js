/*
 * Creating a class which output a specific configuration setting
 */
class myModule {
  constructor (config) {
    this.param = config.get('key1')
  }

  getValue () {
    return this.param
  }
}

module.exports = myModule
