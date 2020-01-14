import multer from "multer";
import { resolve, extname } from "path";

import crypto from "crypto";

export default {
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      return cb(null, resolve(__dirname, "../", "../", "tmp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (error, buf) => {
        if (error) {
          return cb(error);
        }
        return cb(null, buf.toString("hex") + extname(file.originalname));
      });
    }
  })
};
