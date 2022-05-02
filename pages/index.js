import Head from "next/head";
import styles from "../styles/Home.module.css";
import { PrismaClient } from "@prisma/client";
import currentShoppingList from "../store/current_sl_context";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar";
import ItemsPage from "../components/items_page";
import { SWRConfig } from "swr";
import safeJsonStringify from "safe-json-stringify";
import axios from "axios";

const prisma = new PrismaClient();

export default function Home({ fallback }) {
	const [initialOpt, setInitialOpt] = useState(0);
	const [activeShopingList, setActiveShopingList] = useState({
		id: "",
		name: "",
		createdAt: "",
		status: "",
		items: [],
	});
	useEffect(() => {
		axios.get("/api/get_sl/all_items").then((response) => {
			const newSL = { ...response.data.content };
			setActiveShopingList(newSL);
		});
	}, []);
	const reloadProvider = async () => {
		axios.get("/api/get_sl/all_items").then((response) => {
			const newSL = { ...response.data.content };
			setActiveShopingList(newSL);
			console.log("provider reloaded!");
		});
	};
	const [activeMenu, setActiveMenu] = useState(0); //0: items, 1: history, 2: stats
	return (
		<div className={styles.container}>
			<Head>
				<title>Shoppingify</title>
				<meta name="description" content="Shopping notes app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<currentShoppingList.Provider value={activeShopingList}>
				<SideBar
					activeMenu={activeMenu}
					setActiveMenu={setActiveMenu}
					setInitialOpt={setInitialOpt}
				/>
				<SWRConfig value={{ fallback }}>
					<ItemsPage reloadProvider={reloadProvider} initialOpt={initialOpt} />
				</SWRConfig>
			</currentShoppingList.Provider>
		</div>
	);
}

export async function getServerSideProps(context) {
	/*const category = await prisma.category.create({
		data: {
			name: "Fish and Meat",
		},
	});*/
	let items = await prisma.category.findMany({
		include: {
			items: true,
		},
	});
	const resp = {
		message: "data ready",
		data: items,
	};
	console.log(resp);
	return {
		props: {
			fallback: {
				"/api/items/get_all": JSON.parse(safeJsonStringify(resp)),
			},
		}, // will be passed to the page component as props
	};
}
