import Head from "next/head";
import styles from "../styles/Home.module.css";
import { PrismaClient } from "@prisma/client";
import currentShoppingList from "../store/current_sl_context";
import isMobileScreen from "../store/screen_context";
import { useState, useEffect } from "react";
import SideBar from "../components/sidebar";
import ItemsPage from "../components/items_page";
import HistoryPage from "../components/history_page";
import StatPage from "../components/stat_page";
import ShoppingList from "../components/shopping_list";
import { SWRConfig } from "swr";
import safeJsonStringify from "safe-json-stringify";
import axios from "axios";

const prisma = new PrismaClient();

export default function Home({ fallback }) {
	const [initialOpt, setInitialOpt] = useState(0);
	const [isMobile, setIsMobile] = useState(false);

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
		const detectSize = () => {
			if (window.innerWidth < 600) {
				setIsMobile(true);
			} else {
				setIsMobile(false);
			}
		};
		window.addEventListener("resize", detectSize);

		return () => {
			window.removeEventListener("resize", detectSize);
		};
	}, []);
	const reloadProvider = async () => {
		axios.get("/api/get_sl/all_items").then((response) => {
			const newSL = { ...response.data.content };
			setActiveShopingList(newSL);
			console.log("provider reloaded!");
		});
	};
	const [activeMenu, setActiveMenu] = useState(0); //0: items, 1: history, 2: stats, 3: active SL
	return (
		<div className={styles.container}>
			<Head>
				<title>Shoppingify</title>
				<meta name="description" content="Shopping notes app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<currentShoppingList.Provider value={activeShopingList}>
				<isMobileScreen.Provider value={isMobile}>
					<SideBar
						activeMenu={activeMenu}
						setActiveMenu={setActiveMenu}
						setInitialOpt={setInitialOpt}
					/>
					{activeMenu === 0 && (
						<SWRConfig value={{ fallback }}>
							<ItemsPage
								reloadProvider={reloadProvider}
								initialOpt={initialOpt}
							/>
						</SWRConfig>
					)}
					{activeMenu === 1 && <HistoryPage reloadProvider={reloadProvider} />}
					{activeMenu === 2 && <StatPage reloadProvider={reloadProvider} />}
					{isMobile && activeMenu === 3 && (
						<ShoppingList reloadProvider={reloadProvider} />
					)}
				</isMobileScreen.Provider>
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
