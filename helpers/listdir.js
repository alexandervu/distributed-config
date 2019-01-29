const fs = require('fs')
const path = require('path')
const IGNORE_DIR_LIST = ['node_modules', 'coverage', 'test', 'tests', '__test__', '__tests__']
const FILE_PATTERN = '.config(?=.(json|yaml|yml|js)$)'

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @method parsedir
 * @param {String} dir
 * @param {Function} done callback
 * @param {Array} ignoredirs ignore directory list
 */
function parsedir (dir, done, ignoredirs = IGNORE_DIR_LIST, filepattern = FILE_PATTERN) {
  const fileRegexp = new RegExp(filepattern, 'i')

  let results = []

  fs.readdir(dir, (err, list) => {
    if (err) return done(err)

    let pending = list.length

    if (!pending) return done(null, results)

    list.forEach(file => {
      file = path.resolve(dir, file)

      fs.stat(file, (err, stat) => {
        if (err) return done(err)

        // If directory, execute a recursive call
        if (stat && stat.isDirectory() && !ignoredirs.includes(path.basename(file)) && !path.basename(file)[0] !== '.') {
          // Add directory to array [uncomment if you need to add the directories to the array]
          // results.push(file)

          parsedir(file, (err, res) => {
            if (err) return done(err)

            results = results.concat(res)
            if (!--pending) done(null, results)
          }, ignoredirs, filepattern)
        } else {
          if (fileRegexp.test(file)) {
            results.push(file)
          }

          if (!--pending) done(null, results)
        }
      })
    })
  })
};

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @method parsedirSync
 * @param {object} options
 * @return {array}
 */
function parsedirSync (dir, filepattern = FILE_PATTERN, ignoredirs = IGNORE_DIR_LIST) {
  if (typeof filepattern !== 'string') {
    filepattern = FILE_PATTERN
  }

  // Set empty Array when argument is false, null, 0 ... or empty string
  if (!ignoredirs || (typeof ignoredirs === 'string' && !ignoredirs.length)) {
    ignoredirs = []
  }

  // When argument is not an array set default
  if (!Array.isArray(ignoredirs)) {
    ignoredirs = IGNORE_DIR_LIST
  }

  const fileRegexp = new RegExp(filepattern, 'i')
  let result = []

  fs.readdirSync(dir).forEach(file => {
    file = path.resolve(dir, file)
    let stat = fs.statSync(file)

    if (stat && stat.isDirectory() && !ignoredirs.includes(path.basename(file))) {
      // Add directory to array [uncomment if you need to add the directories to the array]
      // results.push(file)
      let subresult = parsedirSync(file, filepattern, ignoredirs)

      if (subresult instanceof Error) return subresult
      result = result.concat(subresult)
    } else {
      // File extension is valid, push to result
      if (fileRegexp.test(file)) result.push(file)
    }
  })

  return result
};

module.exports = { parsedir, parsedirSync }
