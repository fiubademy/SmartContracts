const ethers = require("ethers");
const accounts = [];
const dbClient = require("../database.js").db;

const getDeployerWallet = ({ config }) => () => {
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  const wallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  console.log("Deployer wallet" + wallet.address);
  return wallet;
};

const createWallet = () => async user_id => {
  const provider = new ethers.providers.InfuraProvider("kovan", process.env.INFURA_API_KEY);
  // This may break in some environments, keep an eye on it
  const wallet = ethers.Wallet.createRandom().connect(provider);
  await dbClient.db().collection("accounts").insertOne({
    _id: user_id,
    address: wallet.address,
    privateKey: wallet.privateKey,
  });
  /*accounts.push({
          address: wallet.address,
          privateKey: wallet.privateKey,
        });*/
  const result = {
    id: user_id, //accounts.length,
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
  //return accounts[index - 1];
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
