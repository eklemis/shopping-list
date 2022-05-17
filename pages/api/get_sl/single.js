import { getItems } from "../../../lib/sl_data";
export default async function handler(req, res) {
	try {
		console.log("Single received request, id:", req.body.id);
		const allItems = await getItems(req.body.id);
		res.status(200).json({ message: "success", content: allItems });
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
