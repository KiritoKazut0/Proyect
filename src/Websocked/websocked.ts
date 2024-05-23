import WebSocket from 'ws';
import { Server } from 'http';
import { addCommentPublication, getComments } from '../Controllers/comments';
export const setUpWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log("Nuevo cliente conectado");

    ws.on('message', async (message) => {
      const { publicationId, comment, userId, accion } = JSON.parse(message.toString());

      switch (accion) {
        case "postMessage":

          try {
            const send = await addCommentPublication(publicationId, comment, userId);
           
            
            if (send) {
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify(send));
                }
              });
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
              ws.send(JSON.stringify({
                event: "getcomments",
                data: comments
              }));
            } else {
              ws.send(JSON.stringify({ error: 'Publicación no encontrada' }));
            }
          } catch (error) {
            console.error('Error al obtener los comentarios:', error);
            ws.send(JSON.stringify({ error: 'Error al obtener los comentarios' }));
          }
          break;


      }
    });
  });
};