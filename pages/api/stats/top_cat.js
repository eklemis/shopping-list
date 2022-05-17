import { TopThreeCat } from "../../../lib/summary";
export default async function handler(req, res) {
	try {
		const topThreeCats = await TopThreeCat();
		res.status(200).json({
			message: "success",
			content: { tops: topThreeCats },
		});
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
