require("dotenv").config();
const { handler } = require("../../functions/confirm-user-signup");

const we_invoke_confirmUserSignup = async (username, name, email) => {
  const context = {};
  const event = {
    version: "1",
    region: "us-east-1",
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    userName: username,
    triggerSource: "PostConfirmation_ConfirmSignUp",
    request: {
      userAttributes: {
        sub: username,
        "cognito:email_alias": email,
        "cognito:user_status": "CONFIRMED",
        email_verified: "false",
        name,
        email,
      },
    },
    response: {},
  };
  await handler(event, context);
};

module.exports = {
  we_invoke_confirmUserSignup,
};
