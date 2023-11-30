import { Router } from "express";
import {
  createComplaint_type,
  listAllTypes,
  listInputs,
  listAllClaimsTypeByNameAndId,
  listClaimTypeByID,
  listActiveTypes,
  disableType,
  activeType,
  updateType,
  deleteComplaintType,
} from "../services/tipo-reclamo";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router.route("/inputs").get(listInputs);
router.route("/").get(checkRol(["CAPATAZ", "JEFE"]), listActiveTypes);
router.route("/todos").get(checkRol(["CAPATAZ", "JEFE"]), listAllTypes);
router
  .route("/:id")
  .post(checkRol(["CAPATAZ", "JEFE"]), activeType)
  .patch(checkRol(["CAPATAZ", "JEFE"]), updateType)
  .put(checkRol(["CAPATAZ", "JEFE"]), disableType)
  .delete(checkRol(["JEFE"]), deleteComplaintType);

router.route("/").post(checkRol(["JEFE"]), createComplaint_type);
router.route("/todos/:id").get(checkRol(["CAPATAZ", "JEFE"]), listAllClaimsTypeByNameAndId);
router.route("/detalle/:id").get(listClaimTypeByID);

export { router };
