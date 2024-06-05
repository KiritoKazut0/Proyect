import Publication from "../Models/Publication/Publication.models";
import Users from "../Models/User/users.models";
import { Request, Response, NextFunction } from 'express'
export const addPublication = async (req: Request, res: Response) => {
    try {
        const { content, image, userId } = req.body;

        console.log({userId});
        
        const existedUser = await Users.findById(userId);
        
        if (!existedUser) return res.status(404).json({ message: "User not found" });
        
        const newPublication = new Publication({
            content,
            image,
            user: existedUser._id, 
            date: Date.now() 
        });

        await newPublication.save();
        
        return res.status(201).json(newPublication);

    } catch (error) {
        console.error("Error in the server:", error);

        return res.status(500).json({
            message: "Error in the server"
        });
    }
};




export const getAllPublications = async (_req: Request, res: Response) => {
    try {
        const publications = await Publication.find()
        .populate('user', 'username imgPerfil')
        .select('-comment -reactions')
        .lean();


        return res.status(200).json({
            success: true,
            data: publications
        });

    } catch (error) {
        console.error("Error getting all publications:", error);

        return res.status(500).json({
            success: false,
            message: "Error getting all publications",
            error: error
        });
    }
};





