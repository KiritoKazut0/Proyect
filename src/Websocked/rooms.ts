import WebSocket from 'ws';
import { Server } from 'http';
import { addCommentPublication, getComments } from '../Controllers/comments';

// @chat openai and backend

export const setUpWebSocket = (server: Server) => {
  const publicationSockets : any = {}; 

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log("Nuevo cliente conectado");
    console.log({publicationSockets});
    
   
    ws.onerror = (error) => {
      console.error('Error en la conexión WebSocket:', error);
    };

    ws.on('close', () => {
      console.log('Conexión cerrada');
      
     
      Object.entries(publicationSockets).forEach(([publicationId, socket]) => {
        if (socket === ws) {
          delete publicationSockets[publicationId];
        }
      });
    });

    ws.on('message', async (message) => {
      const { publicationId, comment, userId, accion } = JSON.parse(message.toString());


      switch (accion) {
        case "postMessage":
          try {
            const newComment = await addCommentPublication(publicationId, comment, userId);
            if (newComment) {
             
              if (publicationSockets[publicationId] && publicationSockets[publicationId].readyState === WebSocket.OPEN) {
                publicationSockets[publicationId].send(JSON.stringify({ event: 'newComment', data: newComment }));
              } else {
                ws.send(JSON.stringify({ error: 'La conexión WebSocket para esta publicación está cerrada' }));
              }
            } else {
              ws.send(JSON.stringify({ error: 'Publicación no encontrada' }));
            }
          } catch (error) {
            console.error('Error al procesar el mensaje:', error);
            ws.send(JSON.stringify({ error: 'Error al procesar el mensaje' }));
          }
          break;
        case "getcomments":
          try {
            const comments = await getComments(publicationId);
            if (comments) {
              ws.send(JSON.stringify({ event: "getcomments", data: comments }));
              
            } else {
              ws.send(JSON.stringify({ error: 'Publicación no encontrada' }));
            }
          } catch (error) {
            console.error('Error al obtener los comentarios:', error);
            ws.send(JSON.stringify({ error: 'Error al obtener los comentarios' }));

          }
          break;

        case "registerPublication":

            console.log("se unio a la publicacion");
          publicationSockets[publicationId] = ws;
          break;
      }
      
    });
  });
};
