// helpers.js
//

const customRequest = require("./customRequest");

const urlRegex = /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;

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

/*
 *
 */
function icxCall(contract, method, paramsObj = {}) {
  const rpcObj = {
    jsonrpc: "2.0",
    method: "icx_call",
    id: Math.ceil(Math.random() * 1000),
    params: {
      to: contract,
      dataType: "call",
      data: {
        method: method
      }
    }
  };
  if (Object.keys(paramsObj).length > 0) {
    rpcObj.params.data.params = { ...paramsObj };
  }

  return rpcObj;
}

/*
 *
 */
function getScoreApi(contract) {
  const rpcObj = {
    jsonrpc: "2.0",
    method: "icx_getScoreApi",
    id: Math.ceil(Math.random() * 1000),
    params: {
      address: contract
    }
  };

  return rpcObj;
}
/*
 *
 */
function btpGetNetworkInfo(id) {
  const rpcObj = {
    jsonrpc: "2.0",
    method: "btp_getNetworkInfo",
    id: Math.ceil(Math.random() * 1000),
    params: {
      id: id
    }
  };

  return rpcObj;
}

/*
 *
 */
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

/*
 *
 */
async function makeIcxCallRequest(url, contract, method, params = {}) {
  const rpcObj = icxCall(contract, method, params);
  const stringified = JSON.stringify(rpcObj);

  try {
    const query = await makeJsonRpcCall(stringified, url, customRequest);
    return query;
  } catch (err) {
    console.log(err);
    return null;
  }
}

/*
 *
 */
async function makeGetScoreApiRequest(url, contract) {
  const rpcObj = getScoreApi(contract);
  const stringified = JSON.stringify(rpcObj);

  try {
    const query = await makeJsonRpcCall(stringified, url, customRequest);
    return query;
  } catch (err) {
    console.log(err);
    return null;
  }
}
async function makeBtpGetNetworkInfoRequest(url, id) {
  const rpcObj = btpGetNetworkInfo(id);
  const stringified = JSON.stringify(rpcObj);

  try {
    const query = await makeJsonRpcCall(stringified, url, customRequest);
    return query;
  } catch (err) {
    console.log(err);
    return null;
  }
}

function makeEthJsonRpcObj(
  contract,
  data,
  callType = "eth_call",
  useLatestBlock = true
) {
  let params;
  if (contract == null) {
    params = [data];
  } else {
    params = [
      {
        to: contract,
        data: data
      }
    ];
  }
  if (useLatestBlock) {
    params.push("latest");
  }
  const jsonRpcObj = {
    jsonrpc: "2.0",
    method: callType,
    id: Math.ceil(Math.random() * 1000),
    params: params
  };
  return jsonRpcObj;
}

function makeEthCallJsonRpcObj(contract, data, useLatestBlock = true) {
  return makeEthJsonRpcObj(contract, data, "eth_call", useLatestBlock);
}

async function makeEthJsonRpcCall(url, contract, data) {
  const jsonRpcObj = makeEthCallJsonRpcObj(contract, data);
  const urlObj = makeUrlObject(url);
  const query = await customRequest(
    urlObj.path,
    JSON.stringify(jsonRpcObj),
    urlObj.hostname,
    urlObj.protocol == "http" ? false : true,
    urlObj.port == "" ? false : urlObj.port,
    true
  );
  return query;
}

function getMethodFromAbi(methodName, abi) {
  let result;

  for (const each of abi) {
    if (each.name === methodName) {
      result = each;
    }
  }

  return result;
}

const helpers = {
  hexToDecimal,
  decimalToHex,
  fromHexInLoop,
  makeIcxCallRequest,
  makeGetScoreApiRequest,
  makeBtpGetNetworkInfoRequest,
  makeEthJsonRpcCall,
  getMethodFromAbi
};

module.exports = helpers;
