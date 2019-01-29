const listdir = require('../listdir.js')

// jest.mock('fs')

describe('Test async listdir methods', () => {
  test('Read test directory and verify result', (done) => {
    listdir.parsedir('./__mocks__/allFileExtensions', (err, result) => {
      expect(err).toBe(null)
      expect(result).toHaveLength(7)
      done()
    })
  })

  test('Try to read diretory that not exists', (done) => {
    listdir.parsedir('./__mocks__/notExistentDir', (err, results) => {
      if (err) {
        done()
      }
    })
  })

  test('Try to read diretory that do not contains config files', (done) => {
    listdir.parsedir('./__mocks__/emptyDir', (err, result) => {
      expect(err).toBe(null)
      expect(result).toHaveLength(0)
      done()
    })
  })
})

describe('Test sync listdir methods', () => {
  test('Read test directory and verify result', () => {
    expect(listdir.parsedirSync('./__mocks__/allFileExtensions')).toHaveLength(7)
  })

  test('Try to read diretory that not exists', () => {
    expect(() => {
      listdir.parsedirSync('./notExistentDir')
    }).toThrow()
  })

  test('Try to read diretory which do not contain any config file', () => {
    expect(listdir.parsedirSync('./__mocks__/emptyDir')).toHaveLength(0)
  })

  test('Read test directory and file pattern argument', () => {
    expect(listdir.parsedirSync('./__mocks__/allFileExtensions', '.config(?=.(json|json5|hjson|yaml|yml|js)$)')).toHaveLength(9)
  })

  test('Read test directory and wrong typed file pattern argument', () => {
    expect(listdir.parsedirSync('./__mocks__/allFileExtensions', ['.config(?=.(json|json5|hjson|yaml|yml|js)$)'])).toHaveLength(7)
  })

  test('Read test directory and null ignoredirs argument', () => {
    expect(listdir.parsedirSync('./__mocks__/allFileExtensions', '.config(?=.(json|json5|hjson|yaml|yml|js)$)', null)).toHaveLength(9)
  })

  test('Read test directory and wrong typed ignoredirs argument', () => {
    expect(listdir.parsedirSync('./__mocks__/allFileExtensions', '.config(?=.(json|json5|hjson|yaml|yml|js)$)', {})).toHaveLength(9)
  })
})
