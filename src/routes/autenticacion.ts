import { Router } from "express";
import { newUser, login } from "../services/autenticacion";
import { activateAccount } from "../utils/generetTokenIdUsername";
import {
    requestPasswordRestore,
    retorePassword,
} from "../utils/restorePassword";

const router = Router();

router.post("/registrarse", newUser);
router.post("/ingresar/", login);
router.route("/restaurar-password").post(requestPasswordRestore);

router.route("/restaurar-password/:token").patch(retorePassword);

router.patch("/activar-cuenta/:token", activateAccount);

export { router };
