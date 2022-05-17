import { prisma } from "../db";
import { ListStatus } from "@prisma/client";

export async function getActiveItems() {
	const activeSlId = await getActiveId();
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
	return theActiveItems;
}
export async function getAll() {
	const allSl = await prisma.shoppingList.findMany();
	return allSl;
}
export async function getActive() {
	const theActive = await prisma.shoppingList.findFirst({
		where: {
			status: ListStatus.ACTIVE,
		},
	});
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
	const theActive = await prisma.shoppingList.findFirst({
		where: {
			status: ListStatus.ACTIVE,
		},
		select: {
			id: true,
		},
	});
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
export async function getItems(id) {
	const theRequested = await prisma.shoppingListItems.findMany({
		where: {
			shoppingListId: id,
		},
		include: {
			item: {
				include: {
					categories: true,
				},
			},
		},
	});
	return theRequested;
}
