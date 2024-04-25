// TODO: create and store in a real database
const users: Record<string, User> = {};

export interface User {
  id: string;
  username: string;
}

export abstract class UserRepository {
  public static createUser(user: User) {
    users[user.id] = user;

    return Promise.resolve(user);
  }

  public static getAllUsers() {
    return Promise.resolve(Object.values(users));
  }

  public static findUserById(userId: string) {
    const user = users[userId];

    if (user) {
      return Promise.resolve(user);
    }
  }

  public static findUserByUsername(username: string) {
    const user = Object.entries(users).find(
      ([, user]) => user.username == username
    );

    if (user) {
      return Promise.resolve(user[1]);
    }
  }
}
