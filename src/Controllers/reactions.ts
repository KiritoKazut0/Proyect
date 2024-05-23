import Publication from "../Models/Publication/Publication.models";
import { Request, Response } from "express";

let waitingClients: Response[] = [];


export const getReaccionsInitialsById = async(req:Request, res: Response) => {
    const {id} = req.params;

    try {
       const publication = await Publication.findById(id);
        let sendReaccion = publication?.reactions.length;
        
        if (sendReaccion === undefined || sendReaccion === null) sendReaccion = 0
        
       return res.status(200).json({reaccion: sendReaccion})

    } catch (error) {
        console.log("hubo un error al buscar por id", error);
        return res.status(500).send('error al buscar por id ')
    }

}   


export const newReaccion = async (_req: Request, res: Response) => {
    try {
        if (!waitingClients) {
            waitingClients = [];
        }
        waitingClients.push(res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'error en el servidor' });
    }
}

export const addReaction = async (req: Request, res: Response) => {
    try {
        const { userId, idPublication, reaction } = req.body;

        const publicación = await Publication.findById(idPublication);
        if (!publicación) return res.status(404).json({ message: 'publicación no encontrada' });

        // Verificar si ya reaccionó
        const existingReaction = publicación.reactions.find(reaction => reaction.user.toString() === userId);
        if (existingReaction) return res.status(400).json({ message: 'El usuario ya ha reaccionado a esta publicación', value:true })

        // Agregar la reacción
        publicación.reactions.push({ user: userId, typeReaction: reaction });

        await publicación.save();
        
        // Obtener el conteo de reacciones
        const countReacciones = publicación.reactions.length;

        notifyWaitingClients(countReacciones);
        return res.status(200).json({ countReacciones });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "error al agregar la reacción" });
    }
}

function notifyWaitingClients(countReacciones: number) {
    waitingClients.forEach(client => {
        client.json({ success: true, countReacciones });
        client.end();
    });
    waitingClients = [];
}


