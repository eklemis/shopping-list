import { prisma } from "../db";
import { ListStatus } from "@prisma/client";

export async function getActiveItems() {
	const activeSlId = await getActiveId();
	console.log(`getting active SL items of SL(${activeSlId})...`);
	const theActiveItems = await prisma.shoppingListItems.findMany({
		where: {
			shoppingListId: activeSlId,
		},
		include: {
			item: {
				include: {
					categories: true,
				},
			},
		},
	});
	console.log("Active items: ", theActiveItems);
	return theActiveItems;
}
export async function getAll() {
	console.log("getting all SLs...");
	const allSl = await prisma.shoppingList.findMany();
	return allSl;
}
export async function getActive() {
	console.log("getting active SL content...");
	const theActive = await prisma.shoppingList.findFirst({
		where: {
			status: ListStatus.ACTIVE,
		},
	});
	console.log("The active LS:", theActive);
	console.log("The active LS:", theActive);
	if (theActive === null) {
		console.log("No active SL. Creating new one...");
		const newSL = await prisma.shoppingList.create({
			data: {
				name: "Shopping list",
			},
		});
		return newSL;
	}
	return theActive;
}
export async function getActiveId() {
	console.log("getting active SL id...");
	const theActive = await prisma.shoppingList.findFirst({
		where: {
			status: ListStatus.ACTIVE,
		},
		select: {
			id: true,
		},
	});
	console.log("The active LS:", theActive);
	if (theActive === null) {
		console.log("No active SL. Creating new one...");
		const newSL = await prisma.shoppingList.create({
			data: {
				name: "Shopping list",
			},
		});
		return newSL.id;
	}
	return theActive.id;
}
export async function getSingle(id) {
	const theRequested = await prisma.shoppingList.findMany();
	return theRequested;
}
