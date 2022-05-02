import styles from "./items_page.module.css";
import { useState } from "react";
import Page from "./frames/page";
import SidePage from "./frames/side_page";
import ContentPage from "./frames/content_page";
import ShoppingList from "./shopping_list";
import NewItem from "./new_item";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";

export default function ItemsPage({ reloadProvider, initialOpt }) {
	const addSLItem = async (itemId) => {
		const serverResponse = await axios.post("/api/shopping_list/new_sl_item", {
			itemId: itemId,
		});
		if (serverResponse.data.data) {
			reloadProvider();
		}
	};
	const [sidePageOpt, setSidePageOpt] = useState(initialOpt); //0: shopping list, 1: new item form, 2: item-detil
	useEffect(() => {
		setSidePageOpt(initialOpt);
	}, [initialOpt]);
	const fetcher = (...args) => fetch(...args).then((res) => res.json());
	const { data, error } = useSWR("/api/items/get_all", fetcher);
	let catComponents;
	if (data) {
		const getItems = (row) => {
			if (row.items.length > 0) {
				return row.items.map((item) => (
					<li key={"itemEl-" + item.id} className={styles.item}>
						<span>
							<a
								href="#"
								onClick={() => {
									setSidePageOpt(2);
								}}
							>
								{item.name}
							</a>
						</span>
						<button
							onClick={() => {
								addSLItem(item.id);
							}}
						></button>
					</li>
				));
			}
			return null;
		};
		catComponents = data.data?.map((row) => {
			const items = getItems(row);
			return (
				<section key={"sec" + row.id} className={styles.group}>
					<h4>{row.name}</h4>
					<ul className={styles["catogory-wrapper"]}>{items}</ul>
				</section>
			);
		});
	}
	return (
		<Page>
			<ContentPage>
				<div className={styles.header}>
					<h1 className={styles.title}>
						<span>Shoppingify</span> allows you take your shopping list wherever
						you go
					</h1>
					<input type="text" className={styles.search} />
				</div>
				<div>
					{error && <p>Failed load content</p>}
					{!error && !data && <p>Fetching data...</p>}
					{data && catComponents}
				</div>
			</ContentPage>
			<SidePage>
				{sidePageOpt === 0 && <ShoppingList setSidePageOpt={setSidePageOpt} />}
				{sidePageOpt === 1 && <NewItem setSidePageOpt={setSidePageOpt} />}
			</SidePage>
		</Page>
	);
}
