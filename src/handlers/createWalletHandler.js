function schema() {
  return {
    body: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
        },
      },
    },
    required: ["user_id"],
  };
}

function handler({ walletService }) {
  return async function (req, reply) {
    const body = await walletService.createWallet(req.body.user_id);
    return reply.code(200).send(body);
  };
}

module.exports = { handler, schema };
