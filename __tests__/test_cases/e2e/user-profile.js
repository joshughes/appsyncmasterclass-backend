const given = require("../../steps/given");
const when = require("../../steps/when");
const then = require("../../steps/then");
const chance = require("chance").Chance();

describe("Given an authenticated user", () => {
  let user = {};
  beforeAll(async () => {
    user = await given.an_authenticated_user();
  });

  it("The user can fetch his profile with getMyProfile", async () => {
    const profile = await when.a_user_calls_getMyProfile(user);
    expect(profile).toMatchObject({
      id: user.userName,
      name: user.name,
      imageUrl: null,
      backgroundImageUrl: null,
      bio: null,
      location: null,
      website: null,
      birthdate: null,
      tweetsCount: 0,
      createdAt: expect.stringMatching(/Z$/),
      follwersCount: 0,
      followingCount: 0,
      likesCount: 0,
    });
    const [firstName, lastName] = user.name.split(" ");
    expect(profile.screenName).toContain(firstName);
    expect(profile.screenName).toContain(lastName);
  });
});
