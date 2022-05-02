import { getActiveId } from "../../../lib/sl_data";

export default async function handler(req, res) {
	const newItemId = req.body.itemId;
	const activeSlId = await getActiveId();
	/*	
    const newSlItem = await prisma.shoppingListItems.create({
		data: {
			itemId: newItemId,
			itemAmount: 1,
			shoppingListId: activeSlId,
		},
	});
    */
}
