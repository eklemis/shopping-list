import { getCatId } from "../../../lib/cat_helper";
import { prisma } from "../../../db";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
	try {
		const data = req.body;
		const categoryId = await getCatId(data.category);
		console.log("the cat id is :", categoryId);
		console.log("Creating new item...");
		const newItem = await prisma.items.create({
			data: {
				name: data.name,
				note: data.note,
				image: data.image,
				catId: categoryId,
			},
		});
		console.log("Creating new item DONE!");
		res.status(200).json({ status: "success", data: newItem });
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
	}
}
