import { prisma } from "../db";
export async function TopThreeItem() {
	const topThree = await prisma.items.findMany({
		include: {
			_count: {
				select: { shoppingListItems: true },
			},
		},
		orderBy: {
			shoppingListItems: {
				_count: "desc",
			},
		},
		take: 3,
	});
	return topThree;
}
export async function countAllSLItems() {
	const itemsCount = await prisma.shoppingListItems.count();
	return itemsCount;
}
export async function TopThreeCat() {
	const topThree = await prisma.shoppingListItems.findMany({
		include: {
			item: {
				include: {
					categories: true,
				},
			},
		},
	});
	const countCats = [];
	topThree.forEach((row) => {
		if (
			countCats.findIndex((x) => x.name === row.item.categories.name) === -1
		) {
			countCats.push({ name: row.item.categories.name, value: 1 });
		} else {
			countCats[
				countCats.findIndex((x) => x.name === row.item.categories.name)
			].value =
				countCats[
					countCats.findIndex((x) => x.name === row.item.categories.name)
				].value + 1;
		}
	});
	return countCats;
}
export async function PcsPerMonth() {
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const currDate = new Date();
	const currMonthNumber = currDate.getMonth() + 1;
	const currYear = currDate.getFullYear();
	const result = [];
	const itemCount = await prisma.shoppingList.findMany({
		include: {
			_count: {
				select: {
					items: true,
				},
			},
		},
	});
	console.log(itemCount);
	for (let i = 1; i <= currMonthNumber; i++) {
		let countSlItem = 0;
		itemCount.forEach((row) => {
			if (row.createdAt.getMonth() + 1 === i) {
				countSlItem += row._count.items;
			}
		});
		result.push({ name: monthNames[i - 1], itemCount: countSlItem });
	}
	return result;
}
