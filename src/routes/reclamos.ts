import { Request, Response, Router } from "express";
import { activeAdmin, createAdmin, getAdmin } from "../services/admin";
import { checkAuth, checkRol } from "../middleware/middleware";

import { listComplaintsByAreas, listDetailComplaints, changeTrackingStatus } from "../services/adminReclamo";
import { deleteComplaint, listUserComplaints } from "../services/usuarioReclamo";

const router = Router();

router.use(checkAuth);

router.get("/mis-reclamos", checkRol(["CONTRIBUYENTE"]), listUserComplaints);
router
  .route("/mis-reclamos/:id")
  .get(checkRol(["CONTRIBUYENTE"]), listDetailComplaints)
  .delete(checkRol(["CONTRIBUYENTE"]), deleteComplaint);
router.get("/", checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), listComplaintsByAreas);

router.get("/:id", checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), listDetailComplaints);
router.patch("/:id", checkRol(["EMPLEADO", "CAPATAZ", "JEFE"]), changeTrackingStatus);

export { router };
