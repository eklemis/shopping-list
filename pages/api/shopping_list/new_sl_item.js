import { prisma } from "../../../db";
import { getActiveId } from "../../../lib/sl_data";

export default async function handler(req, res) {
	try {
		const itemId = req.body.itemId;
		const slId = await getActiveId();
		let newItemId;
		// Check if item already in active SL
		const slItem = await prisma.shoppingListItems.findFirst({
			where: {
				AND: {
					itemId: itemId,
					shoppingListId: slId,
				},
			},
		});
		// If no create one,
		if (slItem === null) {
			const newSlItem = await prisma.shoppingListItems.create({
				data: {
					itemId: itemId,
					shoppingListId: slId,
					itemAmount: 1,
				},
			});
			newItemId = newSlItem.id;
		}
		//else update the itemAmount
		else {
			const updatedSlItem = await prisma.shoppingListItems.update({
				where: {
					id: slItem.id,
				},
				data: {
					itemAmount: slItem.itemAmount + 1,
				},
			});
			newItemId = updatedSlItem.id;
		}
		const resItem = await prisma.shoppingListItems.findFirst({
			where: {
				id: newItemId,
			},
			include: {
				item: true,
			},
		});
		res.status(200).json({ status: "success", data: resItem });
		return;
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
	}
}
