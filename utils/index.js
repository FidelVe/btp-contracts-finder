const {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeIcxCallRequest,
  makeGetScoreApiRequest,
  makeBtpGetNetworkInfoRequest,
  makeEthJsonRpcCall,
  getMethodFromAbi
} = require("./helpers");

const customRequest = require("./customRequest");
const SCORES = require("./scores");

const utils = {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  customRequest,
  SCORES,
  makeIcxCallRequest,
  makeGetScoreApiRequest,
  makeBtpGetNetworkInfoRequest,
  makeEthJsonRpcCall,
  getMethodFromAbi
};

module.exports = utils;
