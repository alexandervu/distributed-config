const DistConf = require('../')

describe('Test async loading and parsing config files', () => {
  const distconf = new DistConf({ config_dirs: './__mocks__/allFileExtensions', silent: false })

  test('Check he find all config files', () => {
    expect(distconf.load().getConfigSources()).toHaveLength(9)
  })

  test('Check can read yaml files', () => {
    expect(distconf.load().get('submoduleA.default')).toEqual(true)
  })
})

describe('Test sync loading environment files', () => {
  process.env.NODE_ENV = 'development'
  const distconf = new DistConf()

  test('Verify loaded config value of NODE_ENV environment', () => {
    distconf.load('./__mocks__/filetest2')
    expect(distconf.getEnvironment()).toEqual('development')
    expect(distconf.get('value')).toEqual('development')
  })

  test('Change environment and verify loaded values', () => {
    distconf.setEnvironment('production').load('./__mocks__/filetest2')
    expect(distconf.getEnvironment()).toEqual('production')
    expect(distconf.get('value')).toEqual('production')
  })

  test('Verify local config files override environment', () => {
    distconf.setEnvironment('production').load('./__mocks__/filetest3')
    expect(distconf.getEnvironment()).toEqual('production')
    expect(distconf.get('value')).toEqual('local')
  })

  test('Verify enviroment vars and env config files definition', () => {
    process.env.TEST_ENV = 'shell_env'
    distconf.setEnvironment('production').load('./__mocks__/filetest4')
    expect(distconf.getEnvironment()).toEqual('production')
    expect(distconf.get('value')).toEqual('shell_env')
  })

  test('Test malformated config files1', () => {
    expect(() => {
      distconf.load('./__mocks__/filetest5')
    }).toThrow()
  })
})
