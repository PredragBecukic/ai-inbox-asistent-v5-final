
const PAGE_ACCESS_TOKEN = "EAAMZCWNB5DV0BOyYBj1eFKFOxUanZCmE8CJWyxLycWg4rqYlrhlemgwzp8eB4f5D9BcKwvKavCNKeNi04DiIlHWlEjgQ2c4PKxndkgx9DKBvNzV6ZBIxONbk2HsWSvvZBuHsdlv4y62ZALvS0jsGa7l9TmLZBn1JCX0N7Nc41I3GdrF9a8VnJ3TZALPKfAdZB5VXg3uwKLmctZAfouwbZCnUlsHSQZBdXPDq4TOY9sZB";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = "cipelarnik123";

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  if (req.method === "POST") {
    const body = req.body;

    if (body.object === "page") {
      for (const entry of body.entry) {
        const event = entry.messaging[0];
        const senderId = event.sender.id;

        if (event.message && event.message.text) {
          const userMessage = event.message.text.toLowerCase();
          let reply = "Хвала на поруци! Одговорићемо ускоро. 😊";

          if (userMessage.includes("цена") || userMessage.includes("cena")) {
            reply = "Цена је 2.500 RSD, а поштарина је 450 RSD.";
          } else if (userMessage.includes("број") || userMessage.includes("broj") || userMessage.includes("size")) {
            reply = "За који модел вас интересује број? Можемо одмах проверити.";
          }

          await fetch(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: { id: senderId },
              message: { text: reply },
            }),
          });
        }
      }
      return res.sendStatus(200);
    } else {
      return res.sendStatus(404);
    }
  }

  res.sendStatus(200);
}
