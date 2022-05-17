import { TopThreeItem, countAllSLItems } from "../../../lib/summary";
export default async function handler(req, res) {
	try {
		const topThreeItem = await TopThreeItem();
		const totalItems = await countAllSLItems();
		res
			.status(200)
			.json({
				message: "success",
				content: { tops: topThreeItem, total: totalItems },
			});
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
