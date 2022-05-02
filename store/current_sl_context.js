import { createContext } from "react";

const currentShoppingList = createContext({
	id: "",
	name: "",
	createdAt: "",
	status: "",
	items: [],
});

export default currentShoppingList;
