const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    console.log("Tässä token:", authorization.substring(7))
    req.token = authorization.substring(7)
  } else {
    null
  }
  next()
}

module.exports = {
  tokenExtractor
}
