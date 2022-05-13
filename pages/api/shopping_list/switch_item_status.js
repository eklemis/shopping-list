import { prisma } from "../../../db";
import { getActiveId } from "../../../lib/sl_data";
import { ListItemStatus } from "@prisma/client";

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
		try {
			console.log("req item status:", slItem.item_status);
			const updatedSlItem = await prisma.shoppingListItems.update({
				where: {
					id: slItem.id,
				},
				data: {
					item_status:
						slItem.item_status === ListItemStatus.ACTIVE
							? ListItemStatus.COMPLETED
							: ListItemStatus.ACTIVE,
				},
			});
			res.status(200).json({ status: "success", data: updatedSlItem });
			return;
		} catch (ex) {
			console.log("Error:", ex);
			res.status(500).json({ error: ex, message: "something went wrong!" });
		}
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
	}
}
