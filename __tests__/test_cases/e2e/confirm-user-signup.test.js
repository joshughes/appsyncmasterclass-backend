const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();

describe("When a user signs up", () => {
  it("The user should be saved to the DynamoDB table", async () => {
    const { password, name, email } = given.a_random_user();

    const user = await when.a_user_signs_up(password, name, email);

    const ddb = await then.the_user_exists_in_UsersTable(user.userName);
    expect(ddb).toMatchObject({
      id: user.userName,
      name,
      follwersCount: 0,
      followingCount: 0,
      tweetsCount: 0,
      likesCount: 0,
    });
  });
});
