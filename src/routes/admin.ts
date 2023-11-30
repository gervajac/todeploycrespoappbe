import { Request, Response, Router } from "express";
import {
    activeAdmin,
    createAdmin,
    deleteAdmin,
    disableAdmin,
    getAdmin,
    getActiveAdmins,
    getAllAdmins,
    updatedadmin,
} from "../services/admin";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router
    .route("/")
    .post(checkRol(["JEFE"]), createAdmin)
    .get(checkRol(["JEFE"]), getActiveAdmins);
router.get("/detalle/:id", checkRol(["JEFE"]), getAdmin);
router.get("/todos", checkRol(["JEFE"]), getAllAdmins);
router
    .route("/:id")
    .patch(checkRol(["JEFE"]), updatedadmin)
    .post(checkRol(["JEFE"]), activeAdmin)
    .put(checkRol(["JEFE"]), disableAdmin)
    .delete(checkRol(["JEFE"]), deleteAdmin);

export { router };
