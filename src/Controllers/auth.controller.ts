import User from "../Models/User/users.models";
import Jwt from "jsonwebtoken";
import Config from "../Config/Config";
import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {
    try {
        const { username, email, password, imgPerfil } = req.body;

        const newUser = new User({
            username,
            email,
            password,
            imgPerfil

        })

        newUser.password = await newUser.encrypPassword(newUser.password)

        const userSaved = await newUser.save();

        return res.status(201).json({
            success: true,
            message: "add correct users",
            data: userSaved

        })

    } catch (error) {

        return res.status(500).json({ error: "Internal Server Error" });

    }

}


export const signIn = async (req: Request, res: Response) => {
    try {

        const { email, username, password } = req.body;

        const userFound = await User.findOne({ email, username });

        if (!userFound) return res.status(401).json({
            message: "User not found"
        });

        const matchPassword = await userFound.validatePassword(password)
        if (!matchPassword) return res.status(400).json({
            message: 'Invalid credencials'
        })

        const token = Jwt.sign({ id: userFound.id }, Config.SECRET || '', { expiresIn: 900 });

        return res.json({
            token,
            user: userFound
        })

    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
