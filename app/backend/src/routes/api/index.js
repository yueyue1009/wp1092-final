import { Router } from 'express';
import schedule from './schedule.js';
import user from "./user.js"
import bet from "./bet.js"

const router = Router();

router.use('/schedule', schedule);
router.use('/user', user)
router.use('/bet', bet)

export default router;
