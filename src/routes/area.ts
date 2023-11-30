import { Request, Response, Router } from "express";
import {
  activeArea,
  createArea,
  deleteArea,
  disableArea,
  listActiveAreas,
  listAllAreas,
  listAllAreasByIDorName,
  listAreaByID,
  listAreas,
  updateArea,
} from "../services/area";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router.route("/").post(createArea);
router.route("/todas").get(checkRol(["CAPATAZ", "JEFE"]), listAllAreas);
router.route("/").get(checkRol(["CAPATAZ", "JEFE"]), listActiveAreas);
router.route("/todas/:id").get(checkRol(["CAPATAZ", "JEFE"]), listAllAreasByIDorName);
router.route("/detalle/:id").get(checkRol(["CAPATAZ", "JEFE"]), listAreaByID);
router
  .route("/:id")
  .patch(checkRol(["CAPATAZ", "JEFE"]), updateArea)
  .put(checkRol(["JEFE"]), disableArea)
  .post(checkRol(["JEFE"]), activeArea);
router.route("/:id").delete(checkRol(["JEFE"]), deleteArea);
router.route("/listareas").get(checkRol(["JEFE"]), listAreas);

export { router };
