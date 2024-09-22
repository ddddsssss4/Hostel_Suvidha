import {Router} from 'express';
import { getAllGateEnteries, getAllGateEnteriesByStudent } from '../controllers/gate.controllers.js';

const gateRouter=Router();

gateRouter.route('/allGateEnteries').get(
    getAllGateEnteries
)
gateRouter.route('/allGateEnteriesByStudent/:regNumber').get(
    getAllGateEnteriesByStudent
)

export default gateRouter;