import { NextFunction, Request, Response } from "express"

export interface errors  {
    username: string,
    password: string,
    email: string
}

export const validateFields = (req: Request, res: Response, next: NextFunction) => {

    const { username, email, password, imgPerfil } = req.body;
    const errorsMessage = {} as errors;

    if (!username && !email && !password ) {
        return res.status(400).json({
            message: "Please provide all required data"
        });
    }

    if (!username) errorsMessage.username = "Username is required";
    if (!password) errorsMessage.password = "Password is required";
    if (!email) errorsMessage.email = "Email is required";
    
    
    if (Object.keys(errorsMessage).length > 0) {
        return res.status(400).json(errorsMessage);
    }

    next();
};
