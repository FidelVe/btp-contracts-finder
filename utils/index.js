const {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeIcxCallRequest
} = require("./helpers");

const customRequest = require("./customRequest");
const SCORES = require("./scores");

const utils = {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  customRequest,
  SCORES,
  makeIcxCallRequest
};

module.exports = utils;
