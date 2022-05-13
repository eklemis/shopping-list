import { prisma } from "../../../db";
import { getActiveId } from "../../../lib/sl_data";

export default async function handler(req, res) {
	try {
		const itemId = req.body.itemId;
		const slId = await getActiveId();
		// Check if item already in active SL
		const slItem = await prisma.shoppingListItems.findFirst({
			where: {
				AND: {
					id: itemId,
					shoppingListId: slId,
				},
			},
		});
		if (slItem === null) {
			res.status(406).json({ status: "failed", message: "item not found!" });
			return;
		}
		if (slItem.itemAmount > 1) {
			const updatedSlItem = await prisma.shoppingListItems.update({
				where: {
					id: slItem.id,
				},
				data: {
					itemAmount: slItem.itemAmount - 1,
				},
			});
			res.status(200).json({ status: "success", data: updatedSlItem });
		} else {
			await prisma.shoppingListItems.delete({
				where: {
					id: slItem.id,
				},
			});
			res.status(200).json({ status: "success", data: "deleted item" });
		}

		return;
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
	}
}
