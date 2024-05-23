import { Router } from "express";
import * as autjwtCtrl from "../../Controllers/auth.controller"
import * as verifyFields from "../../Middlewares/FieldsUsers/FieldsUsers.middleware"

const router = Router();

router.post('/singIn', verifyFields.validateFields, autjwtCtrl.signIn );
router.post('/singUp', verifyFields.validateFields, autjwtCtrl.signUp)

export default router;