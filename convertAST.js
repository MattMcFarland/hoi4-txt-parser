function convertAST(ast) {
  if (ast.type === 'prog') return parseProgram(ast);
  if (ast.type === 'assign') return parseAssignment(ast);
  if (ast.type === 'binary') return parseBinary(ast);
  return ast.value
}

function parseBinary(ast) {
  return `${ast.left.value} ${ast.operator} ${ast.right.value}`
  // const chunk = {
  //   [ast.left.value]: convertAST(ast.right),    
  // }
  // chunk.operator = ast.operator
  // return chunk
}
function parseAssignment (ast) {
  return {
    [ast.left.value]: convertAST(ast.right)
  }
}
function parseProgram (ast) {
  return ast.prog.reduce((acc, item) => {
    if (item.type === 'assign' && item.left && item.left.value && item.right) {
      acc[item.left.value] = convertAST(item.right)
    }
    return acc
  }, {})
}

module.exports = convertAST