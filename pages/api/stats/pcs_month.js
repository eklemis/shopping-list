import { PcsPerMonth } from "../../../lib/summary";
export default async function handler(req, res) {
	try {
		const pcsPerMonth = await PcsPerMonth();
		res.status(200).json({
			message: "success",
			content: pcsPerMonth,
		});
		return;
	} catch (er) {
		res.status(500).json({ message: "error", error: er });
		return;
	}
}
