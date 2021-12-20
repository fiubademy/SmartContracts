const ethers = require("ethers");
const getDepositHandler = require("../handlers/getDepositHandler");
const dbClient = require("../database.js").db;

const getContract = (config, wallet) => {
  return new ethers.Contract(config.contractAddress, config.contractAbi, wallet);
};

//const deposits = {};

const deposit = ({ config }) => async (senderWallet, amountToSend) => {
  const basicPayments = getContract(config, senderWallet);
  const tx = await basicPayments.deposit({
    value: ethers.utils.parseEther(amountToSend).toHexString(),
  });
  tx.wait(1).then(
    receipt => {
      console.log("Transaction mined");
      const firstEvent = receipt && receipt.events && receipt.events[0];
      console.log(firstEvent);
      if (firstEvent && firstEvent.event == "DepositMade") {
        dbClient.db().collection("deposits").insertOne({
          _id: tx.hash,
          senderAddress: firstEvent.args.sender,
          amountSent: firstEvent.args.amount,
        });
      } else {
        console.error(`Payment not created in tx ${tx.hash}`);
      }
    },
    error => {
      const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
      const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
      console.error("reasons List");
      console.error(reasonsList);

      console.error("message");
      console.error(message);
    },
  );
  return tx;
};

const depositFromOwner = ({ config }) => async amountToSend => {
  const provider = new ethers.providers.InfuraProvider(config.network, config.infuraApiKey);
  const senderWallet = ethers.Wallet.fromMnemonic(config.deployerMnemonic).connect(provider);
  const basicPayments = getContract(config, senderWallet);
  const tx = await basicPayments.deposit({
    value: ethers.utils.parseEther(amountToSend).toHexString(),
  });
  tx.wait(1).then(
    receipt => {
      console.log("Transaction mined");
      const firstEvent = receipt && receipt.events && receipt.events[0];
      console.log(firstEvent);
      if (firstEvent && firstEvent.event == "DepositMade") {
        dbClient.db().collection("deposits").insertOne({
          _id: tx.hash,
          senderAddress: firstEvent.args.sender,
          amountSent: firstEvent.args.amount,
        });
      } else {
        console.error(`Payment not created in tx ${tx.hash}`);
      }
    },
    error => {
      const reasonsList = error.results && Object.values(error.results).map(o => o.reason);
      const message = error instanceof Object && "message" in error ? error.message : JSON.stringify(error);
      console.error("reasons List");
      console.error(reasonsList);

      console.error("message");
      console.error(message);
    },
  );
  return tx;
};

const getDepositReceipt = ({}) => depositTxHash => {
  return dbClient.db().collection("deposits").findOne({ _id: depositTxHash });
};

module.exports = dependencies => ({
  deposit: deposit(dependencies),
  depositFromOwner: depositFromOwner(dependencies),
  getDepositReceipt: getDepositReceipt(dependencies),
});
