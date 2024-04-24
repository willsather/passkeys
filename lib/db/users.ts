// TODO: create and store in a real database
const users: Record<string, User> = {};

export interface User {
  id: string;
  username: string;
}

export async function createUser(user: User) {
  users[user.id] = user;

  return Promise.resolve(user);
}

export async function getAllUsers() {
  return Promise.resolve(Object.values(users));
}

export async function findUserById(userId: string) {
  const user = users[userId];

  if (user) {
    return Promise.resolve(user);
  }
}

export async function findUserByUsername(username: string) {
  const user = Object.entries(users).find(
    ([, user]) => user.username == username
  );

  if (user) {
    return Promise.resolve(user[1]);
  }
}
