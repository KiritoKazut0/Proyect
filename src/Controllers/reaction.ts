import Publication from "../Models/Publication/Publication.models";
import { Request, Response } from "express";

let waitingClients: Response[] = [];
// mando todas las reacciones de totales de cada publicacion y si ya reacciono en cada publicacion dicho usuario 
//
export const getReaccionsInitialForAll = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        const publications = await Publication.find({}, '_id reactions').lean();

        const processedPublications = publications.map(pub => {
            const hasReacted = pub.reactions.some(reaction => reaction.user.toString() === id);
            return {
                id: pub._id,
                reactionCount: pub.reactions.length,
                hasReacted
            };
        });

        return res.status(200).json({
            publications: processedPublications
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error al obtener las publicaciones." });
    }
};

export const addReactions = async (req: Request, res: Response) => {
    try {
        const { userId, idPublication, reaction } = req.body;

        const publication = await Publication.findById(idPublication);
        if (!publication) return res.status(404).json({ message: 'Publicación no encontrada' });

        const existingReaction = publication.reactions.find(reaction => reaction.user.toString() === userId);
        if (existingReaction) return res.status(400).json({ message: 'El usuario ya ha reaccionado a esta publicación', value: true });

        publication.reactions.push({ user: userId, typeReaction: reaction });

        await publication.save();

        const reactionCount = publication.reactions.length;

        const notificationData = { reactionCount, hasReacted: true, id: idPublication };
        notifyWaitingClients(notificationData);

        return res.status(200).json(notificationData);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error al agregar la reacción" });
    }
};

export const newReactions = async (_req: Request, res: Response) => {
    try {
        if (!waitingClients) {
            waitingClients = [];
        }
        waitingClients.push(res);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

function notifyWaitingClients(notificationData: { reactionCount: number, hasReacted: boolean, id: string }) {
    waitingClients.forEach(client => {
        client.json({ success: true, ...notificationData });
        client.end();
    });
    waitingClients = [];
}