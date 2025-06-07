module.exports = {
    ...require('./xrplClient'),
    ...require('./fundWallet'),
    ...require('./deriveAddress'),
    ...require('./getBalance'),
    ...require('./sendXRP'),
    ...require('./mintPassport')
  };