const os = jest.genMockFromModule('os')

let mockResult = 'localhost.mock'

function __setMockResult (newMockResult) {
  mockResult = newMockResult
}

function hostname () {
  if (typeof mockResult === 'object') throw mockResult
  return mockResult
}

os.__setMockResult = __setMockResult
os.hostname = hostname

module.exports = os
