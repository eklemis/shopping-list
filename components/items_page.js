import styles from "./items_page.module.css";
import { useState } from "react";
import Page from "./frames/page";
import SidePage from "./frames/side_page";
import ContentPage from "./frames/content_page";
import ShoppingList from "./shopping_list";
import NewItem from "./new_item";
import ItemDetail from "./item_detail";
import useSWR from "swr";
import axios from "axios";
import isMobileScreen from "../store/screen_context";
import { useEffect, useContext } from "react";

export default function ItemsPage({
	reloadProvider,
	initialOpt,
	setSidePageOpt,
	sidePageOpt,
}) {
	const isMobile = useContext(isMobileScreen);
	const addSLItem = async (itemId) => {
		const serverResponse = await axios.post("/api/shopping_list/new_sl_item", {
			itemId: itemId,
		});
		if (serverResponse.data.data) {
			reloadProvider();
		}
	};

	const [detilData, setDetilData] = useState({
		id: "",
		image: "",
		name: "",
		category: "",
		note: "",
	});
	const [keyword, setKeyword] = useState("");
	const fetcher = (...args) => fetch(...args).then((res) => res.json());
	const { data, error } = useSWR("/api/items/get_all", fetcher);
	let catComponents;
	if (data) {
		const getItems = (row) => {
			if (row.items.length > 0) {
				return row.items.map((item) => {
					if (
						keyword?.trim() === "" ||
						(keyword?.trim() !== "" &&
							item.name.toLowerCase().includes(keyword.trim().toLowerCase()))
					)
						return (
							<li key={"itemEl-" + item.id} className={styles.item}>
								<span>
									<a
										href="#"
										onClick={() => {
											console.log("item-log", item);
											setDetilData({
												id: item.id,
												image: item.image,
												name: item.name,
												category: item.categories.name,
												note: item.note,
											});
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
						);
				});
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
				{!isMobile && (
					<div className={styles.header}>
						<h1 className={styles.title}>
							<span>Shoppingify</span> allows you take your shopping list
							wherever you go
						</h1>
						<input
							type="text"
							className={styles.search}
							value={keyword}
							onChange={(ev) => {
								setKeyword(ev.target.value);
							}}
						/>
					</div>
				)}
				<div>
					{error && <p>Failed load content</p>}
					{!error && !data && <p>Fetching data...</p>}
					{data && catComponents}
				</div>
			</ContentPage>
			{!isMobile && (
				<SidePage>
					{sidePageOpt === 0 && (
						<ShoppingList
							setSidePageOpt={setSidePageOpt}
							reloadProvider={reloadProvider}
						/>
					)}
					{sidePageOpt === 1 && <NewItem setSidePageOpt={setSidePageOpt} />}
					{sidePageOpt === 2 && (
						<ItemDetail
							setSidePageOpt={setSidePageOpt}
							{...detilData}
							addSLItem={addSLItem}
						/>
					)}
				</SidePage>
			)}
		</Page>
	);
}
