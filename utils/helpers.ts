import * as bcrypt from 'bcrypt';

class Helper {
  public hashPassword(rawPassword: string) {
    return bcrypt.hashSync(rawPassword, 10);
  }

  public comparePassword(rawPassword: string, hashedPassword: string) {
    return bcrypt.compareSync(rawPassword, hashedPassword);
  }
}

export default new Helper();
