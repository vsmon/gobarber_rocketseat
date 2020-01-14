import User from "../models/User";
import File from "../models/File";
import jwt from "jsonwebtoken";

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;
    const { secret_key } = process.evn;
    const user = await User.findOne({
      where: { email },
      include: [
        { attributes: ["id", "url", "path"], model: File, as: "avatar" }
      ]
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario nao existe!" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password invalido!" });
    }

    const { id, name, avatar } = user;
    const token = await jwt.sign({ id }, secret_key, { expiresIn: "7d" });

    return res.json({
      user: {
        name,
        email,
        avatar
      },
      token
    });
  }
}

export default new SessionController();
