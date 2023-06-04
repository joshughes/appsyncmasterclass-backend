require("dotenv").config();
const { handler } = require("../../functions/confirm-user-signup");
const AWS = require("aws-sdk");
const fs = require("fs");
const velocityMapper = require("amplify-appsync-simulator/lib/velocity/value-mapper/mapper");
const velocityTemplate = require("amplify-velocity-template");
const GraphQL = require("../lib/graphql");

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

const we_invoke_an_appsync_template = (templatePath, context) => {
  const template = fs.readFileSync(templatePath, "utf8");
  const ast = velocityTemplate.parse(template);
  const compiler = new velocityTemplate.Compile(ast, {
    valueMapper: velocityMapper.map,
    escape: false,
  });
  console.log(compiler.render(context));
  return JSON.parse(compiler.render(context));
};

const a_user_calls_getMyProfile = async (user) => {
  const getMyProfile = `query MyQuery {
        getMyProfile {
          backgroundImageUrl
          bio
          birthdate
          createdAt
          followingCount
          follwersCount
          id
          imageUrl
          likesCount
          location
          name
          screenName
          tweetsCount
          website
        }
      }
    `;
  const data = await GraphQL(
    process.env.API_URL,
    getMyProfile,
    {},
    user.accessToken
  );
  const profile = data.getMyProfile;
  console.log(`[${user.username}] - fetched profile`);

  return profile;
};

module.exports = {
  we_invoke_confirmUserSignup,
  a_user_signs_up,
  we_invoke_an_appsync_template,
  a_user_calls_getMyProfile,
};
