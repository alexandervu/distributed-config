/*
 * Creating a class which output a specific configuration setting
 */
class myModule {
  constructor (config) {
    this.param = config.get('key2')
  }

  getValue () {
    return this.param
  }
}

module.exports = myModule
