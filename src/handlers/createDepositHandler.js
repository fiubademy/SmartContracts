function schema() {
  return {
    body: {
      type: "object",
      properties: {
        senderId: {
          type: "string",
        },
        amountInEthers: {
          type: "number",
        },
      },
    },
    required: ["senderId", "amountInEthers"],
  };
}

function handler({ contractInteraction, walletService }) {
  return async function (req) {
    return contractInteraction.deposit(await walletService.getWallet(req.body.senderId), (req.body.amountInEthers).toString());
  };
}

module.exports = { schema, handler };
