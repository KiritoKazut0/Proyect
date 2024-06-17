import {Router} from "express"
import * as ctrlPublication from "../../Controllers/Publication.controller"
import { getReaccionsInitialForAll, newReactions, addReactions } from "../../Controllers/reaction";
import { TokenValidation } from "../../Middlewares/auth/authJwt";

const router = Router();

router.post('/',   ctrlPublication.addPublication);
router.get('/',  ctrlPublication.getAllPublications);
//rutas de las reacciones
router.post('/reaction-initial', getReaccionsInitialForAll );
router.get('/reaction', newReactions);
router.post('/reaction/add',addReactions );

export default router;