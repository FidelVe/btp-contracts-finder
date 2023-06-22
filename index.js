const {
  makeGetScoreApiRequest,
  getAllBtpNetworkInfo,
  bmcGetLinks,
  bmcGetServices,
  bmcGetVerifiers,
  bmcGetBtpAddress,
  getBtpContracts,
  getBmcContract
} = require("./lib");

// const nodeUrl = "https://server02.espanicon.team/api/v3";
const testData = {
  icon1: {
    rpc: "https://server02.espanicon.team/api/v3",
    chainType: "goloop",
    chainId: "0x3.icon"
  },
  eth1: {
    chainId: "0x539.hardhat",
    rpc: "https://server03.espanicon.team",
    chainType: "evm"
  },
  bsc1: {
    chainId: "0x61.bsc",
    rpc: "https://data-seed-prebsc-1-s1.binance.org:8545",
    chainType: "evm"
  },
  havah1: {
    chainId: "0x111.icon",
    rpc: "https://btp.vega.havah.io/api/v3/icon_dex",
    chainType: "goloop"
  }
};

async function main() {
  const nodeUrl = testData.icon1.rpc;
  // const r1 = await getAllBtpNetworkInfo(
  //   nodeUrl
  //   // "https://berlin.net.solidwallet.io/api/v3/icon_dex"
  // );
  // console.log("## Registered BTP Network Info for all networks");
  // console.log(r1);

  // const r3 = await makeGetScoreApiRequest(nodeUrl, r1[0].owner);
  // console.log("## BMC ABI");
  // console.log(r3);

  // const r2 = await bmcGetLinks(nodeUrl, r1[1].owner);
  // console.log("## BMC Links");
  // console.log(r2);

  // const r4 = await bmcGetServices(nodeUrl, r1[1].owner);
  // console.log("## BMC Services");
  // console.log(r4);

  // const r5 = await bmcGetVerifiers(nodeUrl, r1[1].owner);
  // console.log("## BMC Verifiers");
  // console.log(r5);

  // const r6 = await bmcGetBtpAddress(nodeUrl, r1[1].owner);
  // console.log("## BMC BTP Address");
  // console.log(r6);

  const r7 = await getBtpContracts(testData.icon1, testData.eth1);
  console.log("## BTP Contracts");
  console.log(r7);
}

async function main2() {
  const r = getBmcContract("0x0a5a8d0d397a8e9f9f67d7d622f4f1c3b0e1a2d2");
  console.log(r);
}

main();
