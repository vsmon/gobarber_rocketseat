import jwt from "jsonwebtoken";

export default async function(req, res, next) {
  const { authorization } = req.headers;
  const { secret_key } = process.evn;

  if (!authorization) {
    return res.status(401).json({ error: "Token nao enviado!" });
  }

  const [, token] = authorization.split(" ");

  try {
    const decoded = await jwt.verify(token, secret_key);
    req.userId = decoded.id;
  } catch (error) {
    return res.status(401).json({ error: "Token inválido!" });
  }

  return next();
}
