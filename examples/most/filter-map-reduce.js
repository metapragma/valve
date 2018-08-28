/* tslint:disable no-console */

const { range } = require('lodash')
const { from } = require('most')

const array = range(parseInt(process.argv.slice(2)[0], 10))

from(array)
  .filter(x => x % 2 === 0)
  .map(i => i + 1)
  .reduce((x, y) => x + y, 0)
  .then(result => {
    console.log(result)
    console.log('completed')
  })
