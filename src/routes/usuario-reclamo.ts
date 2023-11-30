import { Router } from "express";
import {
    createComplaint,
    deleteComplaint,
    listUserComplaints,
    listDetailComplaints,
    updateComplaint,
} from "../services/usuarioReclamo";
import { checkAuth, checkRol } from "../middleware/middleware";

const router = Router();

router.use(checkAuth);

router.route("/").get(listUserComplaints);
router.route("/").post(createComplaint);
router.route("/:id").get(listDetailComplaints).patch(updateComplaint);

export { router };
