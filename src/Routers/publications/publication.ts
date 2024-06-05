import {Router} from "express"
import * as ctrlPublication from "../../Controllers/Publication.controller"
import { addReaction, newReaccion, getReaccionsInitialsById } from "../../Controllers/reactions";
import { TokenValidation } from "../../Middlewares/auth/authJwt";

const router = Router();

router.post('/',  ctrlPublication.addPublication);
router.get('/',  ctrlPublication.getAllPublications);
router.post('/reaction/add', TokenValidation,  addReaction);
router.post('/reaction', TokenValidation,  newReaccion);
router.get('/reaction-initial/:id', TokenValidation,  getReaccionsInitialsById);


export default router;