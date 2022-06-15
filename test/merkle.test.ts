import { ethers } from "hardhat";
import {
  Merkle__factory,
  MerkleProof__factory,
  Merkle,
  MerkleProof,
} from "../typechain";
import { keccak256, solidityKeccak256 } from "ethers/lib/utils";
import MerkleTree from "merkletreejs";
import { expect } from "chai";
import { BigNumber } from "ethers";

let MerkleVy: Merkle;
let MerkleSol: MerkleProof;

describe("Test Merkle verifiers", () => {
  before("deploy contracts", async () => {
    const [deployer] = await ethers.getSigners();
    const vyMerkleFactory = new Merkle__factory(deployer);
    MerkleVy = await vyMerkleFactory.deploy();
    await MerkleVy.deployed();
    const solMerkleFactory = new MerkleProof__factory(deployer);
    MerkleSol = await solMerkleFactory.deploy();
    await MerkleSol.deployed();
  });
  it("Creates tree and tests verifiers", async () => {
    const accounts = await ethers.getSigners();
    const randoms: BigNumber[] = [];
    const leaves = accounts.map((account) => {
      const rn = ethers.BigNumber.from(ethers.utils.randomBytes(32));
      randoms.push(rn);
      return solidityKeccak256(["address", "uint256"], [account.address, rn]);
    });
    const tree = new MerkleTree(leaves, keccak256, { sort: true });
    const root = tree.getHexRoot();

    const leaf = leaves[Math.floor(Math.random() * (leaves.length - 1))];
    const proof = tree.getHexProof(leaf);

    const vyVerify = await MerkleVy.setNum(proof, root, leaf);
    await vyVerify.wait();
    const tNum = await MerkleVy.testNum();
    expect(Number(tNum)).to.be.greaterThan(0);
    const solVerify = await MerkleSol.setNum(proof, root, leaf);
    await solVerify.wait();
    const tNumSol = await MerkleSol.testNum();
    expect(Number(tNumSol)).to.be.greaterThan(0);
  });
});
