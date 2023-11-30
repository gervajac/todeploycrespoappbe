import { Router } from "express";
import {
    activeNeighborhood,
    createNeighborhood,
    listNeighborhoods,
    listNeighborhood,
    listdisableNeighborhoods,
    updateNeighborhood,
    listAllNeighborhoodsByIdName,
    disableNeighborhood,
    inputs,
    deleteNeighborhood,
    listAllNeighborhoods,
} from "../services/barrio";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router.route("/inputs").get(inputs);
router.route("/").get(listNeighborhoods);
router.route("/detalle/:id").get(listNeighborhood);
router
    .route("/")
    .post(checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), createNeighborhood);
router
    .route("/todos/:id")
    .get(checkRol(["CAPATAZ", "JEFE"]), listAllNeighborhoodsByIdName);
router.route("/todos/").get(checkRol(["JEFE"]), listAllNeighborhoods);
router
    .route("/:id")
    .patch(checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), updateNeighborhood)
    .put(checkRol(["CAPATAZ", "JEFE"]), disableNeighborhood)
    .post(checkRol(["CAPATAZ", "JEFE"]), activeNeighborhood);
router.route("/:id").delete(checkRol(["JEFE"]), deleteNeighborhood);

export { router };
