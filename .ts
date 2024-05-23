import express from 'express';
import Publication from "./src/Models/Publication/Publication.models";
import { Request, Response } from 'express';
const app = express();
app.use(express.json());

// Lista de clientes esperando una nueva reacción
let waitingClients = [];

app.get('/reactions/wait', (req:Request, res:Response) => {
  // Agregar el cliente a la lista de clientes en espera
  waitingClients.push(res);

  // Configurar un temporizador para cerrar la conexión después de un tiempo
  const timeoutId = setTimeout(() => {
    res.json({ message: 'No new reactions' });
    res.end();
    waitingClients = waitingClients.filter(client => client !== res);
  }, 60000); // 60 segundos de tiempo de espera

  // Manejar el cierre de la conexión por parte del cliente
  req.on('close', () => {
    clearTimeout(timeoutId);
    waitingClients = waitingClients.filter(client => client !== res);
  });
});

app.post('/reactions', async (req, res) => {
  try {
    const { userId, idPublication, reaction } = req.body;
    const publication = await Publication.findById(idPublication);

    if (!publication) {
      return res.status(404).json({ message: 'Publication not found' });
    }

    const existingReaction = publication.reactions.find(
      (reaction) => reaction.user.toString() === userId
    );

    if (existingReaction) {
      return res.status(400).json({ message: 'User has already reacted to this publication' });
    }

    publication.reactions.push({ user: userId, typeReaction: reaction });
    const updatedPublication = await publication.save();

    // Notificar a los clientes en espera sobre la nueva reacción
    notifyWaitingClients(updatedPublication);

    return res.status(200).json(updatedPublication);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error adding reaction" });
  }
});

function notifyWaitingClients(updatedPublication) {
  waitingClients.forEach(client => {
    client.json({ success: true, updatedPublication });
    client.end();
  });
  waitingClients = [];
}

app.listen(3000, () => console.log("Server is running on port 3000"));