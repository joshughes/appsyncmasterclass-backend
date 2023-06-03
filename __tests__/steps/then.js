require("dotenv").config();
const AWS = require("aws-sdk");

const the_user_exists_in_UsersTable = async (id) => {
  const DynamoDB = new AWS.DynamoDB.DocumentClient();
  const resp = await DynamoDB.get({
    TableName: process.env.USERS_TABLE,
    Key: {
      id,
    },
  }).promise();
  expect(resp.Item).toBeTruthy();
  return resp.Item;
};

module.exports = {
  the_user_exists_in_UsersTable,
};
