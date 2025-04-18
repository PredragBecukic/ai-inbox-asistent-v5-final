
const PAGE_ACCESS_TOKEN = "EAAMZCWNB5DV0BO7lrQJLAN2ZCzncRvCWwkn3uR3j2ZAyN9Hhy8RDhsHHuln9dA9zncnJRYn4FVFX9t4YBP4YowKZAxPrlGbDkRPgbh9DxHy7OagtX0mx92F6m9o0ag1GsEvEOW3Yd0N23Yz2lX8qfH7rh6ejQQ0ZBiZAB7ZCw2y97drW6AYOSOlVUAAvgCX0JDBUj8J8D3c1It3fQbBWgZDZD";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const VERIFY_TOKEN = "novi123token";

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
          const userMessage = event.message.text;

          let reply = "Хвала на поруци! Одговорићемо ускоро. 😊";

          if (userMessage.toLowerCase().includes("цена")) {
            reply = "Цена је 2.500 RSD, а поштарина је 450 RSD.";
          } else if (userMessage.toLowerCase().includes("број") || userMessage.toLowerCase().includes("size")) {
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
