const InputParser = require('./InputParser');
const TokenParser = require('./TokenParser');
const parse = require('./parse');
const convertAST = require('./convertAST');

const code = `
things = {
  some_value > 1
  other_value = foo
  finale_thing = {
    limit = {
      what > 4
      lol = some_lol_thing
      others = {
        some_setting = yes
        some_other_setting = { foo > bar_baz }
      }
    }
  }
}
`

var ast = parse(TokenParser(InputParser(code)));
console.log(require('util').inspect(convertAST(ast), { colors: true, depth: 9 }))
