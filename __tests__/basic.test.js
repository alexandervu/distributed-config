const DistConf = require('../')

jest.mock('os')

describe('Test read external and additional config file', () => {
  const distconf = new DistConf()

  test('Import named external file without namespace', () => {
    distconf.importFile('external.json', './__mocks__/external')
    expect(distconf.store()).toEqual({external: true, nested: {value: 'json'}})
  })

  test('Clean data store', () => {
    distconf.clean()
    expect(distconf.store()).toEqual({})
  })

  test('Import named external file with namespace', () => {
    distconf.importFile('external.json', './__mocks__/external', 'myspace')
    expect(distconf.store()).toEqual({myspace: {external: true, nested: {value: 'json'}}})
  })

  test('Import package.json from project to own namespace', () => {
    distconf.importFile('package.json', null, 'package')
    expect(distconf.get('package.name')).toEqual('distconf')
  })

  test('Should throw an error when file argument is missing', () => {
    expect(() => distconf.importFile()).toThrow()
  })

  test('Should throw an error when namespace argument is not a string', () => {
    expect(() => distconf.importFile('external.json', './__mocks__/external', {})).toThrow()
  })
})

describe('Test set, get, has and clean data store ', () => {
  const distconf = new DistConf()

  test('Set inside empty data store a property with string value ', () => {
    distconf.set('module', 'distconf')
    expect(distconf.store()).toEqual({module: 'distconf'})
  })

  test('Set inside empty data store a property with numer value ', () => {
    distconf.set('version', 1)
    expect(distconf.store()).toEqual({module: 'distconf', version: 1})
  })

  test('Set inside empty data store a property with boolean value ', () => {
    distconf.set('valid', true)
    expect(distconf.store()).toEqual({module: 'distconf', version: 1, valid: true})
  })

  test('Set inside empty data store a property with float value ', () => {
    distconf.set('subversion', 1.7)
    expect(distconf.store()).toEqual({module: 'distconf', version: 1, valid: true, subversion: 1.7})
  })

  test('Overwrite a value with a nested one', () => {
    distconf.set('subversion.one', 2)
    expect(distconf.store()).toEqual({module: 'distconf', version: 1, valid: true, subversion: {one: 2}})
  })

  test('Verify property exists', () => {
    expect(distconf.has('subversion')).toBe(true)
  })

  test('Verify nested property exists', () => {
    expect(distconf.has('subversion.one')).toBe(true)
  })

  test('Verify nested property do not exists', () => {
    expect(distconf.has('subversion.two')).toBeFalsy()
  })

  test('Throw an error when argument is not a string', () => {
    expect(() => distconf.has({})).toThrow()
  })

  test('Get string value', () => {
    expect(distconf.get('module')).toEqual('distconf')
  })

  test('Get number value', () => {
    expect(distconf.get('version')).toEqual(1)
  })

  test('Get boolean value', () => {
    expect(distconf.get('valid')).toEqual(true)
  })

  test('Get float value', () => {
    expect(distconf.get('subversion.one')).toEqual(2)
  })

  test('Clean data store', () => {
    distconf.clean()
    expect(distconf.store()).toEqual({})
  })
})

describe('Test set and get data store failture', () => {
  const distconf = new DistConf()

  test('Set function should fail when key is missing', () => {
    expect(() => distconf.set(undefined, '1')).toThrow()
  })

  test('Set function should fail when key is not a string', () => {
    expect(() => distconf.set([], '1')).toThrow()
  })

  test('Set function should fail when value is missing', () => {
    expect(() => distconf.set('key')).toThrow()
  })

  test('Get function should fail when key is missing', () => {
    expect(() => distconf.get()).toThrow()
  })

  test('Get function should fail when key is not a string', () => {
    expect(() => distconf.get(123)).toThrow()
  })
})

describe('Test set, get and default environment settings', () => {
  test('NODE_ENV is not set, default should be `development`', () => {
    delete process.env.NODE_ENV
    const distconf = new DistConf()
    expect(distconf.getEnvironment()).toEqual('development')
    process.env.NODE_ENV = 'test'
  })

  test('NODE_ENV is set to `production`', () => {
    const distconf = new DistConf()
    expect(distconf.getEnvironment()).toEqual('test')
  })

  test('Overwrite NODE_ENV by method setEnvironment', () => {
    const distconf = new DistConf().setEnvironment('testing')
    expect(distconf.getEnvironment()).toEqual('testing')
  })

  test('Environment argument should thrown when is not empty or string', () => {
    const distconf = new DistConf()
    expect(() => distconf.setEnvironment({})).toThrow()
    expect(() => distconf.setEnvironment(true)).toThrow()
    expect(() => distconf.setEnvironment(1)).toThrow()
    expect(() => distconf.setEnvironment([])).toThrow()
    expect(() => distconf.setEnvironment(function () {})).toThrow()
  })
})

describe('Test set, get and default hostname settings', () => {
  const HOST = process.env.HOST
  const HOSTNAME = process.env.HOSTNAME

  beforeEach(() => {
    delete process.env.HOSTNAME
    delete process.env.HOST
  })

  afterEach(() => {
    process.env.HOST = HOST
    process.env.HOSTNAME = HOSTNAME
  })

  test('Hostname is not set, default should be OS hostname', () => {
    require('os').__setMockResult('localhost.mock')
    const distconf = new DistConf()
    expect(distconf.getHostname()).toEqual('localhost.mock')
  })

  test('Hostname should be set to localhost when `os` module thrown an error', () => {
    require('os').__setMockResult(new Error())
    const distconf = new DistConf()
    expect(distconf.getHostname()).toEqual('localhost')
  })

  test('Environment value HOSTNAME is set', () => {
    process.env.HOSTNAME = 'local.hostname'
    const distconf = new DistConf()
    expect(distconf.getHostname()).toEqual('local.hostname')
  })

  test('Environment value HOST is set', () => {
    delete process.env.HOSTNAME
    process.env.HOST = 'local.host'
    const distconf = new DistConf()
    expect(distconf.getHostname()).toEqual('local.host')
  })

  test('Hostname is set to `distconf.local`', () => {
    const distconf = new DistConf().setHostname('distconf.local')
    expect(distconf.getHostname()).toEqual('distconf.local')
  })

  test('Hostname argument should thrown when is not empty or string', () => {
    const distconf = new DistConf()
    expect(() => distconf.setHostname({})).toThrow()
    expect(() => distconf.setHostname(true)).toThrow()
    expect(() => distconf.setHostname(1)).toThrow()
    expect(() => distconf.setHostname([])).toThrow()
    expect(() => distconf.setHostname(function () {})).toThrow()
  })
})

describe('Test set, get config directories', () => {
  test('Get default config dir, should be process directory', () => {
    const distconf = new DistConf()
    expect(distconf.getConfigDirs()).toEqual([process.cwd()])
  })

  test('Set new config directory as string', () => {
    const distconf = new DistConf().setConfigDirs('./')
    expect(distconf.getConfigDirs()).toEqual(['./'])
  })

  test('Set new config directory as array', () => {
    const distconf = new DistConf().setConfigDirs(['./', '../'])
    expect(distconf.getConfigDirs()).toEqual(['./', '../'])
  })

  test('Throw when dirs argument is empty', () => {
    const distconf = new DistConf()
    expect(() => distconf.setConfigDirs()).toThrow()
  })

  test('Throw when dirs argument is not a string or array', () => {
    const distconf = new DistConf()
    expect(() => distconf.setConfigDirs({})).toThrow()
    expect(() => distconf.setConfigDirs(true)).toThrow()
    expect(() => distconf.setConfigDirs(1)).toThrow()
  })
})
