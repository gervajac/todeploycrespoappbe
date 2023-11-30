import { Request, Response, Router } from "express";

import { checkAuth, checkRol } from "../middleware/middleware";
import { createRol } from "../services/rol";

const router = Router();

router.route("").post(createRol);

export { router };
