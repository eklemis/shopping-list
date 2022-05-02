import { prisma } from "../../../db";

export default async function handler(req, res) {
	try {
		const allCats = await prisma.category.findMany();
		res.status(200).json({ message: "data ready", data: allCats });
		return;
	} catch (er) {
		res.status(500).json({ error: er, message: "something went wrong!" });
		return;
	}
}
