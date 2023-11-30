import { Router } from "express";
import {
    activeStreet,
    createStreet,
    listStreets,
    listStreetByID,
    listAllStreets,
    updateStreet,
    disableStreet,
    listInputs,
    deleteStreet,
    listAllStreetsByID,
} from "../services/calle";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router.route("/inputs").get(listInputs);
router.route("/").get(listStreets);
router.route("/").post(checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), createStreet);
router.route("/todas").get(checkRol(["CAPATAZ", "JEFE"]), listAllStreets);
router
    .route("/todas/:id")
    .get(checkRol(["CAPATAZ", "JEFE"]), listAllStreetsByID);
router.route("/detalle/:id").get(checkRol(["CAPATAZ", "JEFE"]), listStreetByID);
router
    .route("/:id")
    .patch(checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), updateStreet)
    .put(checkRol(["CAPATAZ", "JEFE"]), disableStreet)
    .post(checkRol(["JEFE"]), activeStreet);
router.route("/:id").delete(checkRol(["JEFE"]), deleteStreet);

export { router };
