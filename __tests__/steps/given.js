require("dotenv").config();
const chance = require("chance").Chance();
const velocityUtil = require("amplify-appsync-simulator/lib/velocity/util");
const AWS = require("aws-sdk");

const a_random_user = () => {
  const firstName = chance.first({ nationality: "en" });
  const lastName = chance.last({ nationality: "en" });
  const suffix = chance.string({
    length: 4,
    casing: "lower",
    alpha: true,
    numeric: false,
  });
  const name = `${firstName} ${lastName} ${suffix}`;
  const password = chance.string({ length: 8 });
  const email = `${firstName}-${lastName}-${suffix}@appscync.com`;

  return {
    name,
    password,
    email,
  };
};
const an_appsync_context = (identity, args, result, source, info) => {
  const util = velocityUtil.create([], new Date(), Object());
  const context = {
    identity,
    args,
    arguments: args,
  };
  return {
    context,
    ctx: context,
    util,
    utils: util,
  };
};
const an_authenticated_user = async () => {
  const { name, email, password } = a_random_user();
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

  const auth = await cognito
    .initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId,
      AuthParameters: {
        USERNAME: userName,
        PASSWORD: password,
      },
    })
    .promise();
  console.log(`[${email}] - signed in [${userName}]`);
  return {
    userName,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken,
  };
};
module.exports = {
  a_random_user,
  an_appsync_context,
  an_authenticated_user,
};
