import { getActive, getActiveItems } from "../../../lib/sl_data";
export default async function handler(req, res) {
	try {
		const allItems = await getActiveItems();
		const activSL = await getActive();
		res
			.status(200)
			.json({ message: "success", content: { ...activSL, items: allItems } });
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
