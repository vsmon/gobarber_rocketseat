import Sequelize, { Model } from "sequelize";

import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        provider: Sequelize.BOOLEAN,
        avatar_id: Sequelize.INTEGER
      },
      {
        sequelize
      }
    );
    this.addHook("beforeSave", async user => {
      user.password_hash = await bcrypt.hash(user.password, 8);
    });
    return this;
  }
  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
  static associate(models) {
    this.belongsTo(models.File, { foreignKey: "avatar_id", as: "avatar" });
  }
}

export default User;
