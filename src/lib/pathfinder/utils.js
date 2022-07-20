'use strict'

const nullF = () => {}
module.exports = {
  nullLogger: {
    debug: nullF, info: nullF, warn: nullF, error: nullF
  }
}
