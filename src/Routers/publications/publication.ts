import {Router} from "express"
import * as ctrlPublication from "../../Controllers/Publication.controller"
import { addReaction, newReaccion, getReaccionsInitialsById } from "../../Controllers/reactions";


const router = Router();

router.post('/',ctrlPublication.addPublication)
router.get('/',ctrlPublication.getAllPublications)
router.post('/reaction/add',addReaction)
router.post('/reaction', newReaccion)
router.get('/reaction-initial/:id', getReaccionsInitialsById)


export default router;