const { getBtpContracts, RESULT_PATH } = require("./lib");
const fs = require("fs");

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
  try {
    await getBtpContracts(testData.icon1, testData.eth1);
    console.log("## BTP Contracts:");
    console.log(fs.readFileSync(RESULT_PATH).toString());
  } catch (e) {
    console.log("Error fetching BTP contracts");
    console.error(e);
  }
}

main();
