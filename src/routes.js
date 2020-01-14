import { Router } from "express";
import multer from "multer";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import FileController from "./app/controllers/FileController";
import ProviderController from "./app/controllers/ProviderController";

import auth from "./app/middlewares/auth";
import storage from "./config/multer";
import AppointmentController from "./app/controllers/AppointmentController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";

const routes = new Router();
const upload = multer(storage);

routes.get("/", (req, res) => res.end("ok"));
routes.post("/user", UserController.store);
routes.post("/session", SessionController.store);

routes.use(auth);

routes.get("/user", UserController.index);
routes.put("/user", UserController.update);

routes.get("/provider", ProviderController.index);

routes.post("/file", upload.single("file"), FileController.store);

routes.get("/schedule", ScheduleController.index);

routes.get("/notification", NotificationController.index);
routes.put("/notification/:id", NotificationController.update);

routes.get("/appointment", AppointmentController.index);
routes.post("/appointment", AppointmentController.store);
routes.delete("/appointment/:id", AppointmentController.delete);

export default routes;
