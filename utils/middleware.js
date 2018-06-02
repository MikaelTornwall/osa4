/* const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    return req.token = authorization.substring(7)
  } else {
    null
  }
  next()
}

module.exports = {
  tokenExtractor
}
*/
