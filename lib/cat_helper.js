import { prisma } from "../db";
export async function getCatId(catName) {
	console.log("getting catId for:", catName);
	const category = await prisma.category.findFirst({
		where: {
			name: catName,
		},
	});
	if (category === null) {
		const newCategory = await prisma.category.create({
			data: {
				name: catName,
			},
		});
		return newCategory.id;
	}
	return category.id;
}
