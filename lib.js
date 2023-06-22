// lib.js
//
const {
  makeIcxCallRequest,
  makeBtpGetNetworkInfoRequest,
  makeGetScoreApiRequest,
  makeEthJsonRpcCall,
  getMethodFromAbi
} = require("./utils");
const fs = require("fs");
const Web3 = require("web3");

function getBmcAbi() {
  return JSON.parse(fs.readFileSync("./BMCPeriphery.json", "utf8"));
}

function getBmcContract(contractAddress) {
  const web3 = new Web3();
  const abi = getBmcAbi().abi;

  return new web3.eth.Contract(abi, contractAddress);
}

async function getAllBtpNetworkInfo(url) {
  try {
    const result = [];
    let counter = 1;
    while (counter < 100) {
      const response = await makeBtpGetNetworkInfoRequest(
        url,
        "0x" + counter.toString(16)
      );
      if (response.error == null && response.result != null) {
        result.push(response.result);
        counter++;
      } else {
        break;
      }
    }

    return result;
  } catch (e) {
    console.log(e);
  }
}

async function getBtpNetworkInfo(nodeUrl, networkId) {
  try {
    return await makeBtpGetNetworkInfoRequest(nodeUrl, networkId);
  } catch (e) {
    console.log(e);
  }
}

async function bmcGetLinks(nodeUrl, bmcContract) {
  try {
    return await makeIcxCallRequest(nodeUrl, bmcContract, "getLinks");
  } catch (e) {
    console.log(e);
  }
}

async function bmcGetServices(nodeUrl, bmcContract) {
  try {
    return await makeIcxCallRequest(nodeUrl, bmcContract, "getServices");
  } catch (e) {
    console.log(e);
  }
}

async function bmcGetVerifiers(nodeUrl, bmcContract) {
  try {
    return await makeIcxCallRequest(nodeUrl, bmcContract, "getVerifiers");
  } catch (e) {
    console.log(e);
  }
}

async function bmcGetBtpAddress(nodeUrl, bmcContract) {
  try {
    return await makeIcxCallRequest(nodeUrl, bmcContract, "getBtpAddress");
  } catch (e) {
    console.log(e);
  }
}

/*
 *
 */
async function getBtpContracts(mainNetwork, secondaryNetwork) {
  const mainRpc = mainNetwork.rpc;
  const secondaryRpc = secondaryNetwork.rpc;
  const secondaryId = secondaryNetwork.chainId;
  const secondaryChainType = secondaryNetwork.chainType;
  try {
    const result = {
      main: {
        contracts: {}
      },
      secondary: {
        contracts: {}
      }
    };

    const btpNetworkInfo = await makeBtpGetNetworkInfoRequest(mainRpc, "0x1");

    if (btpNetworkInfo.error == null && btpNetworkInfo.result != null) {
      const bmcLinks = await bmcGetLinks(mainRpc, btpNetworkInfo.result.owner);

      const parsedBmcLinks = {
        networkLabels: []
      };
      bmcLinks.result.forEach(link => {
        const arrayFromLink = link.split("/");
        parsedBmcLinks.networkLabels.push(
          arrayFromLink[arrayFromLink.length - 2]
        );
        parsedBmcLinks[arrayFromLink[arrayFromLink.length - 2]] = {
          contractAddress: arrayFromLink[arrayFromLink.length - 1]
        };
      });

      // if the provided secondary ID is not in the list of parsedBmcLinks raise error
      if (parsedBmcLinks[secondaryId] == null) {
        throw new Error(
          `Secondary chain ID ${secondaryId} is not in the list of available chains: ${parsedBmcLinks.networkLabels}`
        );
      } else {
        result.secondary.networkId = secondaryId;
        result.secondary.contracts.bmc =
          parsedBmcLinks[secondaryId].contractAddress;
      }

      const xCallAddress = await bmcGetServices(
        mainRpc,
        btpNetworkInfo.result.owner
      );

      const bmvContract = await bmcGetVerifiers(
        mainRpc,
        btpNetworkInfo.result.owner
      );

      const btpAddress = await bmcGetBtpAddress(
        mainRpc,
        btpNetworkInfo.result.owner
      );

      const arrayFromBtpAddress = btpAddress.result.split("/");

      result.main = {
        networkId: arrayFromBtpAddress[arrayFromBtpAddress.length - 2],
        contracts: {
          bmc: btpNetworkInfo.result.owner,
          xcall: xCallAddress.result.xcall
        }
      };

      if (bmvContract.result[secondaryId] != null) {
        result.main.contracts.bmv = bmvContract.result[secondaryId];

        if (secondaryChainType === "evm") {
          const web3 = new Web3(secondaryRpc);
          web3.eth.handleRevert = true;
          const abi = getBmcAbi().abi;
          const secondaryBmcContract = new web3.eth.Contract(
            abi,
            parsedBmcLinks[secondaryId].contractAddress
          );

          // obtaining xcall
          // const xcallEncodedCall = await secondaryBmcContract.methods
          //   .getServices()
          //   .call()
          //   .catch(e => {
          //     console.error("%%%%% catches error: ", e);
          //   });
          // console.log("xcallEncodedCall");
          // console.log(xcallEncodedCall);
          //

          // make call to getServices() on secondary chain
          const xcallEncodedCall = secondaryBmcContract.methods
            .getServices()
            .encodeABI();
          // console.log("xcallEncodedCall");
          // console.log(xcallEncodedCall);
          // const rawCall = await makeEthJsonRpcCall(
          //   secondaryRpc,
          //   parsedBmcLinks[secondaryId].contractAddress,
          //   xcallEncodedCall
          // );
          // console.log("rawCall");
          // console.log(rawCall);
          const xcallResponse = await web3.eth.call({
            to: parsedBmcLinks[secondaryId].contractAddress,
            data: xcallEncodedCall
          });
          const abiMethod = getMethodFromAbi("getServices", abi);
          const parsedResponse = web3.eth.abi.decodeParameters(
            abiMethod.outputs,
            xcallResponse
          );
          try {
            result.secondary.contracts.xcall = parsedResponse[0][0].addr;
          } catch (e) {}

          // make call to getVerifiers() on secondary chain
          // const verifiersEncodedCall = secondaryBmcContract.methods
          //   .getVerifiers()
          //   .encodeABI();
          // const verifiersResponse = await web3.eth.call({
          //   to: parsedBmcLinks[secondaryId].contractAddress,
          //   data: verifiersEncodedCall
          // });
          // const verifiersAbiMethod = getMethodFromAbi("getVerifiers", abi);
          // const verifiersParsedResponse = web3.eth.abi.decodeParameters(
          //   verifiersAbiMethod.outputs,
          //   verifiersResponse
          // );
          // console.log("verifiersParsedResponse");
          // console.log(verifiersParsedResponse);
        } else if (secondaryChainType === "goloop") {
          throw new Error(
            `Error: unsupported chain type "${secondaryChainType}"`
          );
        } else {
          throw new Error(`Error: unknown chain type "${secondaryChainType}"`);
        }
        // const bmcContractTwo = getBmcContract();
      } else {
        throw new Error(`Error: network label "${secondaryId}" not found`);
      }

      // for (let network of parsedBmcLinks) {
      //   console.log("network");
      //   console.log(network);
      // }
    } else {
      throw new Error("Error getting BTP network info");
    }

    return result;
  } catch (e) {
    console.log(e);
  }
}

const lib = {
  makeIcxCallRequest,
  makeGetScoreApiRequest,
  makeBtpGetNetworkInfoRequest,
  getAllBtpNetworkInfo,
  bmcGetLinks,
  bmcGetServices,
  bmcGetVerifiers,
  getBtpContracts,
  bmcGetBtpAddress,
  getBmcAbi,
  getBmcContract
};

module.exports = lib;
