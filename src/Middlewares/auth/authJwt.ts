import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Config from '../../Config/Config';


export interface IPayload {
    _id: string;
    iat: number;
} 

interface RequestWithUserId extends Request {
    userId: string | number; 
  }
  

  export const TokenValidation = (req: RequestWithUserId, res: Response, next: NextFunction) => {
    try {
        const token = req.header('token');
        if (!token) return res.status(401).json('Access Denied');

        const payload = jwt.verify(token, Config.SECRET || '') as IPayload;
        req.userId = payload._id;
        next();
    } catch (error) {
        console.log(error);
         
       return res.status(400).send('Invalid Token'); 
    }
}
