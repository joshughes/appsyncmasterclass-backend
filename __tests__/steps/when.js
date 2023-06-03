require("dotenv").config();
const { handler } = require("../../functions/confirm-user-signup");
const AWS = require("aws-sdk");

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

const a_user_signs_up = async (password, name, email) => {
  const cognito = new AWS.CognitoIdentityServiceProvider();
  const UserPoolId = process.env.COGNITO_USER_POOL_ID;
  const ClientId = process.env.WEB_COGNITO_USER_POOL_CLIENT_ID;

  const signUpResp = await cognito
    .signUp({
      ClientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: "name", Value: name }],
    })
    .promise();

  const userName = signUpResp.UserSub;
  console.log(`[${email}] - user has signed up [${userName}]`);

  await cognito
    .adminConfirmSignUp({ UserPoolId, Username: userName })
    .promise();

  console.log(`[${email}] - confirmed sign up [${userName}]`);
  return { userName, name, email };
};

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
};
