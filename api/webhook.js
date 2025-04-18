
export default function handler(req, res) {
  const VERIFY_TOKEN = "novi123token"; // <- Ovo upisuješ u Meta konzoli

  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    } else {
      return res.sendStatus(403);
    }
  }

  return res.sendStatus(200);
}
