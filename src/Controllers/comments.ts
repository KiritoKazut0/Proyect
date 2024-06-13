import Publication from "../Models/Publication/Publication.models";

export const addCommentPublication = async (publicationId: string, comment: string, userId: string) => {
    try {
        const publication = await Publication.findById(publicationId);

        if (!publication) {
            return null;
        }

        const newComment = { user: userId, content: comment, date: new Date() };
        publication.comment.push(newComment);
        await publication.save();


       const publicationSaved = await Publication.findById(publicationId).populate({
        path: 'comment',
        populate: {
            path: 'user',
            select: '-password' 
        }
    });


    if (!publicationSaved) {
        return null;
    }

    // Obtiene la cantidad de comentarios
    const numComments = publicationSaved.comment.length;

        const send = {
            publicationId: publicationId,
            comments: publicationSaved.comment.map(c => ({
                user: c.user,
                content: c.content,
                date: c.date
            })),
            numComments: numComments
        } ;

        return send;
    } catch (error) {
        console.error('Error al añadir comentario a la publicación:', error);
        return null;
    }
};



export const getComments = async (publicationId: string) => {
    try {
        const publication = await Publication.findById(publicationId)
            .populate({
                path: 'comment.user',
                select: '-password'
            });

        if (!publication) {
            return null;
        }

        const numComments = publication.comment.length;

        const comments: any = publication.comment.map(c => ({
            user: c.user,
            content: c.content,
            date: c.date
        }));

        const response = {
                publicationId: publicationId,
                comments: comments,
                numComments: numComments
        };

        return response;
    } catch (error) {
        console.error('Error al obtener los comentarios de la publicación:', error);
        return null;
    }
};
