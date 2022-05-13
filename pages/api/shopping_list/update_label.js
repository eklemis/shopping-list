import { prisma } from "../../../db";
import { getActiveId } from "../../../lib/sl_data";

export default async function handler(req, res) {
	try {
		const newLabel = req.body.newLabel.trim();
		const slId = await getActiveId();
		const updatedSL = await prisma.shoppingList.update({
			where: {
				id: slId,
			},
			data: {
				name: newLabel,
			},
		});
		res.status(200).json({ status: "success", data: updatedSL });
		return;
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
	}
}
