import User from "../models/User";
import File from "../models/File";

class UserController {
  async index(req, res) {
    const user = await User.findAll({
      attributes: ["id", "name", "email", "avatar_id"],
      include: [{ attributes: ["path", "url"], model: File, as: "avatar" }]
    });

    if (!user) {
      return res.status(400).json({ error: "Nenhum usuario encontrado!" });
    }

    return res.json(user);
  }

  async store(req, res) {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ error: "Usuario já existe" });
    }

    const user = await User.create(req.body);

    return res.json(user);
  }

  async update(req, res) {
    const { email, old_password } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res
          .status(401)
          .json({ error: "Usuario ja existe com esse email" });
      }
    }

    if (old_password && !(await user.checkPassword(old_password))) {
      return res.status(401).json({ error: "Senha antiga invalida" });
    }

    await user.update(req.body);

    const { id, name, provider, avatar } = await User.findOne({
      where: { id: req.userId },
      include: [
        { attributes: ["id", "path", "url"], model: File, as: "avatar" }
      ]
    });

    return res.json({
      id,
      name,
      email,
      provider,
      avatar
    });
  }
}

export default new UserController();
