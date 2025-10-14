export default async function handler(req, res) {
  res.status(200).send("Callback OK — OAuth not needed for webhook testing.");
}
