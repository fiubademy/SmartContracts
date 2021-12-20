function schema() {
  return {
    body: {
      type: "object",
      properties: {
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
    return contractInteraction.depositFromOwner(req.body.amountInEthers.toString());
  };
}

module.exports = { schema, handler };
