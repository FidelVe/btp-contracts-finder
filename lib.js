// lib.js
//

const {
  // hexToDecimal,
  // decimalToHex,
  fromHexInLoop,
  makeJSONRPCRequestObj,
  makeTxCallRPCObj,
  makeCustomCallRequestObj,
  makeICXSendTxRequestObj,
  makeICXCallRequestObj,
  customRequest,
  SCORES,
  makeRpcCustomRequest
} = require("./utils");

// SCORE methods
//
// CPS methods
/*
 *
 */
async function getCPSPeriodStatus(nodeUrl) {
  //
  const JSONRPCObject = makeICXCallRequestObj(
    "get_period_status",
    null,
    null,
    SCORES.mainnet.cps
  );

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    nodeUrl
  );

  if (request == null) {
    // Error was raised and handled inside queryMethod, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    if (request.error == null) {
      return request.result;
    } else {
      return request;
    }
  }
}

/*
 *
 */
function voteNetworkProposal(proposalId, vote, prepAddress) {
  return makeTxCallRPCObj(
    prepAddress,
    this.scores.mainnet.governance2,
    "voteProposal",
    {
      id: proposalId,
      vote: vote
    }
  );
}

/*
 *
 */
function approveNetworkProposal(proposalId, prepAddress) {
  return voteNetworkProposal(proposalId, "0x1", prepAddress);
}

// Governance methods
/*
 *
 */
async function getScoreApi(nodeUrl, address = SCORES.mainnet.governance) {
  //
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getScoreApi"),
    params: {
      address: address
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    nodeUrl
  );
  if (request == null) {
    // Error was raised and handled inside queryMethod, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    if (request.error == null) {
      return request.result;
    } else {
      return request;
    }
  }
}

/*
 *
 */
async function getIcxBalance(nodeUrl, address, decimals = 8) {
  const JSONRPCObject = JSON.stringify({
    ...makeJSONRPCRequestObj("icx_getBalance"),
    params: {
      address: address
    }
  });

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    nodeUrl
  );
  if (request == null) {
    // Error was raised and handled inside queryMethod, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    if (request.error == null) {
      return Number(fromHexInLoop(request.result).toFixed(decimals));
    } else {
      return request;
    }
  }
}

/*
 *
 */
async function getPreps(nodeUrl, height = null) {
  const JSONRPCObject = makeICXCallRequestObj(
    "getPReps",
    { startRanking: "0x1" },
    height,
    SCORES.mainnet.governance
  );
  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    nodeUrl
  );
  if (request == null) {
    // Error was raised and handled inside queryMethod, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    if (request.error == null) {
      return request.result;
    } else {
      return request;
    }
  }
}

/*
 *
 */
async function getPrep(nodeUrl, prepAddress) {
  //
  const JSONRPCObject = makeICXCallRequestObj(
    "getPRep",
    { address: prepAddress },
    null,
    SCORES.mainnet.governance
  );

  const request = await customRequest(
    SCORES.apiRoutes.v3,
    JSONRPCObject,
    nodeUrl
  );
  if (request == null) {
    // Error was raised and handled inside queryMethod, the returned value
    // is null. Here we continue returning null and let the code logic
    // after this handle the null values in the most appropiate way depending
    // on the code logic
    return request;
  } else {
    if (request.error == null) {
      return request.result;
    } else {
      return request;
    }
  }
}

/*
 *
 */
function setBonderList(prepAddress, arrayOfBonderAddresses) {
  return makeTxCallRPCObj(
    prepAddress,
    SCORES.mainnet.governance,
    "setBonderList",
    {
      bonderList: [...arrayOfBonderAddresses]
    }
  );
}

void getCPSPeriodStatus;
void approveNetworkProposal;
void getScoreApi;
void getIcxBalance;
void getPreps;
void getPrep;
void setBonderList;

const lib = {
  getScoreApi,
  getPreps,
  makeRpcCustomRequest
};

module.exports = lib;
