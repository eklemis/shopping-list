import { getAll } from "../../../lib/sl_data";
export default async function handler(req, res) {
	try {
		const allSls = await getAll();
		res.status(200).json({ message: "success", content: allSls });
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
