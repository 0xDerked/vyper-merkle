import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-vyper";

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      mining: {
        auto: true,
      },
      timeout: 100_000,
      chainId: 1337,
      accounts: {
        count: 20,
      },
    },
    localhost: {
      timeout: 100_000,
      loggingEnabled: true,
      mining: {
        auto: true,
      },
      url: "http://127.0.0.1:8545/",
    },
  },
  solidity: "0.8.4",
  vyper: { version: "0.3.3" },
  typechain: {
    outDir: "typechain", //for working ONLY in hardhat
    target: "ethers-v5",
  },
  mocha: {
    timeout: 1_200_000,
  },
};

export default config;
