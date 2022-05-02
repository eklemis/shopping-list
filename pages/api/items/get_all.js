import { prisma } from "../../../db";

export default async function handler(req, res) {
	try {
		const allItems = await prisma.category.findMany({
			include: {
				items: {
					include: {
						categories: true,
					},
				},
			},
		});
		res.status(200).json({ message: "data ready", data: allItems });
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
		return;
	}
}
