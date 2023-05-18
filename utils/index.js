const {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeJSONRPCRequestObj,
  makeTxCallRPCObj,
  makeCustomCallRequestObj,
  makeICXSendTxRequestObj,
  makeICXCallRequestObj,
  makeRpcCustomRequest
} = require("./helpers");

const customRequest = require("./customRequest");
const SCORES = require("./scores");

const utils = {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeJSONRPCRequestObj,
  makeTxCallRPCObj,
  makeCustomCallRequestObj,
  makeICXSendTxRequestObj,
  makeICXCallRequestObj,
  customRequest,
  SCORES,
  makeRpcCustomRequest
};

module.exports = utils;
