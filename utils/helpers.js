// helpers.js
//

const customRequest = require("./customRequest");
const SCORES = require("./scores");

/*
 *
 */
function hexToDecimal(hex) {
  return parseInt(hex, 16);
}

/*
 *
 */
function decimalToHex(number) {
  return "0x" + number.toString(16);
}

/*
 *
 */
function fromHexInLoop(loopInHex) {
  let loopInBase2 = hexToDecimal(loopInHex);
  return loopInBase2 / 10 ** 18;
}

/*
 *
 */
function makeJSONRPCRequestObj(method) {
  return {
    jsonrpc: "2.0",
    method: method,
    id: Math.ceil(Math.random() * 1000)
  };
}

/*
 *
 */
function makeTxCallRPCObj(
  from,
  to,
  method,
  paramsObj,
  nid,
  stepLimit = 2000000
) {
  let txObj = makeJSONRPCRequestObj("icx_sendTransaction");
  txObj["params"] = {
    from: from,
    to: to,
    stepLimit: decimalToHex(stepLimit),
    nid: decimalToHex(nid),
    nonce: decimalToHex(Number(1)),
    version: decimalToHex(Number(3)),
    timestamp: decimalToHex(new Date().getTime() * 1000),
    dataType: "call",
    data: {
      method: method,
      params: paramsObj
    }
  };

  return txObj;
}

/*
 *
 */
function makeCustomCallRequestObj(
  icxMethod = "icx_call",
  method,
  params = null,
  height = null,
  to = "cx0000000000000000000000000000000000000000",
  returnString = true
) {
  const JSONRPCRequestObj = makeJSONRPCRequestObj(icxMethod);
  let data = {
    ...JSONRPCRequestObj,
    params: {
      to: to,
      dataType: "call",
      data: {
        method: method
      }
    }
  };

  if (params == null) {
    null;
  } else {
    data.params.data.params = params;
  }

  if (height === null) {
    null;
  } else {
    if (typeof height !== "number") {
      throw new Error("Height type must be number");
    } else {
      data.params.height = "0x" + height.toString(16);
    }
  }

  if (returnString) {
    return JSON.stringify(data);
  } else {
    return data;
  }
}

/*
 *
 */
function makeICXSendTxRequestObj(
  method,
  params = null,
  height = null,
  to = "cx0000000000000000000000000000000000000000",
  returnString = true
) {
  return makeCustomCallRequestObj(
    "icx_sendTransaction",
    method,
    params,
    height,
    to,
    returnString
  );
}

/*
 *
 */
function makeICXCallRequestObj(
  method,
  params = null,
  height = null,
  to = "cx0000000000000000000000000000000000000000",
  returnString = true
) {
  return makeCustomCallRequestObj(
    "icx_call",
    method,
    params,
    height,
    to,
    returnString
  );
}

const networks = {
  mainnet: {
    nid: "1",
    hostname: "ctz.solidwallet.io"
  },
  lisbon: {
    nid: "2",
    hostname: "lisbon.net.solidwallet.io"
  },
  berlin: {
    nid: "7",
    hostname: "berlin.net.solidwallet.io"
  },
  sejong: {
    nid: "83",
    hostname: "sejong.net.solidwallet.io"
  },
  custom: {
    nid: "3",
    hostname: ""
  }
};

const urlRegex = /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;

function isValidIconAddress(address) {
  const regex = /([hH][xX][a-fA-F0-9]{40})$/;
  return regex.test(address);
}

function isValidUrl(urlString) {
  return urlRegex.test(urlString);
}

function makeUrlObject(rpcNode) {
  const inputInLowercase = rpcNode.toLowerCase();
  const parsedUrl = {
    protocol: "https",
    path: "/",
    hostname: null,
    port: "443"
  };

  const regexResult = inputInLowercase.match(urlRegex);

  if (regexResult != null) {
    parsedUrl.protocol = regexResult[2] == null ? "https" : regexResult[2];
    parsedUrl.path = regexResult[7] == null ? "/" : regexResult[7];
    parsedUrl.hostname = regexResult[3] == null ? rpcNode : regexResult[3];
    parsedUrl.port = regexResult[6] == null ? "" : regexResult[6].slice(1);
  }

  return parsedUrl;
}

async function makeJsonRpcCall(data, url, queryMethod) {
  try {
    const urlObj = makeUrlObject(url);
    const path = urlObj.path === "/" ? "/api/v3" : urlObj.path;
    const query = await queryMethod(
      path,
      data,
      urlObj.hostname,
      urlObj.protocol == "http" ? false : true,
      urlObj.port == "" ? false : urlObj.port
    );

    if (query != null) {
      return query;
    } else {
      return {
        error: {
          code: -1,
          message: "Error trying to make request to chain"
        }
      };
    }
  } catch (err) {
    console.log("Error trying to make request to chain");
    console.log(err);
    return {
      error: {
        code: -1,
        message: "Error trying to make request to chain"
      }
    };
  }
}

function makeJsonRpcObj(
  to,
  method,
  paramsObj,
  rpcMethod = "icx_call",
  from,
  nid,
  value,
  stepLimit = 2000000,
  nonce = 1,
  version = 3
) {
  const rpcObj = {
    jsonrpc: "2.0",
    method: rpcMethod,
    id: method,
    params: {
      to: to,
      dataType: "call",
      data: {
        method: method
      }
    }
  };
  if (from != null) {
    rpcObj.params.from = from;
    rpcObj.params.stepLimit = decimalToHex(stepLimit);
    rpcObj.params.nonce = decimalToHex(nonce);
    rpcObj.params.version = decimalToHex(version);
    rpcObj.params.timestamp = decimalToHex(new Date().getTime() * 1000);
  }

  if (nid != null) {
    rpcObj.params.nid = decimalToHex(nid);
  }

  if (value != null) {
    rpcObj.params.value = decimalToHex(value);
  }

  if (Object.keys(paramsObj).length > 0) {
    rpcObj.params.data.params = { ...paramsObj };
  }

  return rpcObj;
}

async function makeRpcCustomRequest(url, contract, method, params) {
  const rpcObj = makeJsonRpcObj(contract, method, params);
  const stringified = JSON.stringify(rpcObj);

  try {
    const query = await makeJsonRpcCall(stringified, url, customRequest);
    return query;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const helpers = {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeJSONRPCRequestObj,
  makeTxCallRPCObj,
  makeCustomCallRequestObj,
  makeICXSendTxRequestObj,
  makeICXCallRequestObj,
  makeRpcCustomRequest
};

module.exports = helpers;
