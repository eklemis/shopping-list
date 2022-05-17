import styles from "./history_page.module.css";
import Page from "./frames/page";
import SidePage from "./frames/side_page";
import ContentPage from "./frames/content_page";
import ShoppingList from "./shopping_list";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import isMobileScreen from "../store/screen_context";

function AllShoppingList({ content, setSelectedSL, setMainPageOpt }) {
	if (content && Object.keys(content).length > 0) {
		const listedMonthYear = [];
		const monthYear = (dtime) =>
			dtime.toLocaleString("en-us", { month: "long" }) +
			" " +
			dtime.getFullYear();

		Object.keys(content).forEach((key) => {
			let currMonthYear = monthYear(new Date(content[key].createdAt));
			if (listedMonthYear.indexOf(currMonthYear) === -1)
				listedMonthYear.push(currMonthYear);
		});
		const getShopHistComps = (_monthYear) =>
			Object.keys(content).map((key) => {
				let activeDate = new Date(content[key].createdAt);
				let currMonthYear = monthYear(activeDate);
				if (currMonthYear === _monthYear) {
					const formatedDate =
						activeDate.toLocaleString("en-us", { weekday: "short" }) +
						" " +
						activeDate.toLocaleString("en-us", {
							day: "2-digit",
						}) +
						"." +
						activeDate.toLocaleString("en-us", {
							month: "2-digit",
						}) +
						"." +
						activeDate.toLocaleString("en-us", {
							year: "numeric",
						});
					return (
						<li key={"shopingList-" + content[key].id}>
							<span>{content[key].name}</span>
							<div>
								<span className={styles.date}>{formatedDate}</span>
								<span
									className={
										styles.status +
										" " +
										styles[content[key].status.toLowerCase()]
									}
								>
									{content[key].status.toLowerCase()}
								</span>
								<button
									onClick={() => {
										setSelectedSL({
											id: content[key].id,
											name: content[key].name,
											createdAt: formatedDate,
										});
										setMainPageOpt(1);
									}}
								></button>
							</div>
						</li>
					);
				}
			});
		const allList = listedMonthYear.map((row, idx) => (
			<section key={"sec" + idx + row} className={styles.group}>
				<h4>{row}</h4>
				<ul className={styles["catogory-wrapper"]}>{getShopHistComps(row)}</ul>
			</section>
		));
		return (
			<div className={styles.wrapper}>
				<ul>{allList}</ul>
			</div>
		);
	}
	return <div>Fetching data...</div>;
}
function DetailShoppingList({ id, name, createdAt, setMainPageOpt }) {
	const [allItems, setAllItems] = useState();
	useEffect(() => {
		axios.post("/api/get_sl/single", { id: id }).then((response) => {
			const allItemsFetched = { ...response.data.content };
			setAllItems(allItemsFetched);
		});
	}, [id]);
	let itemGroups = "Fetching data...";
	if (allItems) {
		const itemsOf = (catName) =>
			Object.keys(allItems).map((idx) => {
				if (allItems[idx].item.categories.name === catName) {
					return (
						<li>
							<span>{allItems[idx].item.name}</span>
							<span>{allItems[idx].itemAmount} pcs</span>
						</li>
					);
				}
			});
		const allCats = [];
		itemGroups = Object.keys(allItems).map((row) => {
			if (allCats.indexOf(allItems[row].item.categories.name) === -1) {
				allCats.push(allItems[row].item.categories.name);
				return (
					<section className={styles["item-group"]}>
						<h4>{allItems[row].item.categories.name}</h4>
						<ul>{itemsOf(allItems[row].item.categories.name)}</ul>
					</section>
				);
			}
		});
	}
	return (
		<>
			<div className={styles.header}>
				<a href="#" onClick={() => setMainPageOpt(0)}>
					back
				</a>
				<h1 className={styles.title}>{name}</h1>
				<span className={styles.date}>{createdAt}</span>
			</div>
			<div>{itemGroups}</div>
		</>
	);
}
export default function HistoryPage({ reloadProvider }) {
	const isMobile = useContext(isMobileScreen);
	const [allSlsContent, setAllSlsContent] = useState();
	const [selectedSL, setSelectedSL] = useState({
		id: "",
		name: "",
		createdAt: "",
	});
	useEffect(() => {
		axios.get("/api/get_sl/all").then((response) => {
			const allSLs = { ...response.data.content };
			setAllSlsContent(allSLs);
		});
	}, []);
	const [sidePageOpt, setSidePageOpt] = useState(0); //0: shopping list, 1: new item form, 2: item-detil
	const [mainPageOpt, setMainPageOpt] = useState(0); //0: showing general information, 1: showing detail information
	return (
		<Page>
			{mainPageOpt === 0 && (
				<ContentPage>
					<div className={styles.header}>
						<h1 className={styles.title}>Shopping history</h1>
					</div>
					<AllShoppingList
						content={allSlsContent}
						setSelectedSL={setSelectedSL}
						setMainPageOpt={setMainPageOpt}
					/>
				</ContentPage>
			)}
			{mainPageOpt === 1 && (
				<ContentPage>
					<DetailShoppingList
						id={selectedSL.id}
						name={selectedSL.name}
						createdAt={selectedSL.createdAt}
						setMainPageOpt={setMainPageOpt}
					/>
				</ContentPage>
			)}
			{!isMobile && (
				<SidePage>
					{sidePageOpt === 0 && (
						<ShoppingList
							setSidePageOpt={setSidePageOpt}
							reloadProvider={reloadProvider}
						/>
					)}
				</SidePage>
			)}
		</Page>
	);
}
