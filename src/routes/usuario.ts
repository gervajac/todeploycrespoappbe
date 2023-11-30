import { Router } from "express";
import { changePassword, getUser, updatedUser } from "../services/usuario";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);
router.route("/").get(checkRol(["CONTRIBUYENTE"]), getUser);
router.route("/actualizar").patch(checkRol(["CONTRIBUYENTE"]), updatedUser);
router.route("/cambiar-password").put(changePassword);

export { router };
