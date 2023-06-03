const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();

describe("When confirmSignUp runs", () => {
  it("The user should be saved to the DynamoDB table", async () => {
    const { name, email } = given.a_random_user();
    const userName = chance.guid();

    await when.we_invoke_confirmUserSignup(userName, name, email);

    const ddb = await then.the_user_exists_in_UsersTable(userName);
    expect(ddb).toMatchObject({
      id: userName,
      name,
      follwersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    });
  });
});
