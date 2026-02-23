import { faker } from "@faker-js/faker";
import userSchema from "../models/user.model.js";

const createRandomUser = () => {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: "user",
    isActive: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),

    password: "123456",

    createdAt: faker.date.between({
      from: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      to: new Date(),
    }),
  };
};
const saveUserToDatabase = async (user) => {
  const length = 100;
  let users = [];
  for (let i = 0; i < length; i++) {
    users.push(createRandomUser());
  }

  try {
    await userSchema.insertMany(users);
    console.log(`${length} random users have been saved to the database.`);
  } catch (err) {
    console.error("Error saving user to database:", err);
  }
};

export default saveUserToDatabase;
