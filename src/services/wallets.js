const ethers = require("ethers");
const dbClient = require("../database.js").db;

const INITIAL_GIFT_AMOUNT = 0.001;

const getDeployerWallet = ({ config }) => () => {
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  console.log("Deployer wallet" + wallet.address);
  return wallet;
};

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

const createWallet = ({ config }) => async user_id => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = await ethers.Wallet.createRandom().connect(provider);
  await dbClient.db().collection("accounts").insertOne({
    _id: user_id,
    address: wallet.address,
    privateKey: wallet.privateKey,
  });
  const walletOwner = await ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  const basicPayments = getContract(config, walletOwner);
  const tx = await basicPayments.sendPayment(
    wallet.address,
    ethers.utils.parseEther(INITIAL_GIFT_AMOUNT.toString()).toHexString(),
  );
  tx.wait(1).then(receipt => {
    console.log("\nTransaction mined.\n");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    if (firstEvent && firstEvent.event == "PaymentMade") {
      console.log("Payment has been correctly made.");
    } else {
      console.error(`Payment not created in tx ${tx.hash}`);
    }
  });

  const result = {
    id: user_id,
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
  return result;
};

const getWalletsData = () => () => {
  return dbClient.db().collection("accounts").find().toArray();
};

const getWalletData = () => index => {
  return dbClient.db().collection("accounts").findOne({ _id: index });
};

const getWallet = ({}) => async index => {
  const provider = await new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  let privateKey = await dbClient.db().collection("accounts").findOne({ _id: index }, { privateKey: 1, _id: 0 });
  privateKey = privateKey.privateKey;
  return new ethers.Wallet(privateKey, provider);
};

module.exports = ({ config }) => ({
  createWallet: createWallet({ config }),
  getDeployerWallet: getDeployerWallet({ config }),
  getWalletsData: getWalletsData({ config }),
  getWalletData: getWalletData({ config }),
  getWallet: getWallet({ config }),
});
