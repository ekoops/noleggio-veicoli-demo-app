class User {
  constructor(id, email) {
    this.id = parseInt(id);
    if (isNaN(this.id)) throw Error("Invalid user id value");
    this.email = email.toString();
  }

  static fromObj({id, email}) {
    return new User(id, email);
  }
}

export default User;