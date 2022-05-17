import styles from "./stat_page.module.css";
import Page from "./frames/page";
import ContentPage from "./frames/content_page";
import SidePage from "./frames/side_page";
import ShoppingList from "./shopping_list";
import ChartComp from "./frames/chart";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import isMobileScreen from "../store/screen_context";

export default function StatPage({ reloadProvider }) {
	const isMobile = useContext(isMobileScreen);
	const [topThreeItems, setTopThreeItems] = useState();
	const [topThreeCats, setTopThreeCats] = useState();
	const [pcsPerMonth, setPcsPerMonth] = useState();
	const [countAllItems, setCountAllItems] = useState(0);
	useEffect(() => {
		axios.get("/api/stats/top_item").then((response) => {
			const topThree = response.data.content.tops;
			const countAll = response.data.content.total;
			setCountAllItems(countAll);
			setTopThreeItems(topThree);
		});
		axios.get("/api/stats/top_cat").then((response) => {
			const topThree = response.data.content.tops;
			topThree.sort((a, b) => b.value - a.value);
			setTopThreeCats(topThree.slice(0, 3));
		});
		axios.get("/api/stats/pcs_month").then((response) => {
			const result = response.data.content;
			setPcsPerMonth(result);
		});
	}, []);
	let TopThreeItemsEl;
	if (topThreeItems) {
		TopThreeItemsEl = topThreeItems.map((row, idx) => {
			const percentage = parseInt(
				(row["_count"].shoppingListItems / countAllItems) * 100
			);
			return (
				<li key={"top-three-item-" + idx}>
					<div className={styles["stat-labels"]}>
						<span>{row.name}</span>
						<span>{percentage}%</span>
					</div>
					<progress value={percentage} max="100">
						{percentage}%{" "}
					</progress>
				</li>
			);
		});
	}
	let TopTreeCatsEl;
	if (topThreeCats) {
		TopTreeCatsEl = topThreeCats.map((row, idx) => {
			const percentage = parseInt((row["value"] / countAllItems) * 100);
			return (
				<li key={"top-three-cat-" + idx}>
					<div className={styles["stat-labels"]}>
						<span>{row.name}</span>
						<span>{percentage}%</span>
					</div>
					<progress value={percentage} max="100" className={styles["top-cat"]}>
						{percentage}%{" "}
					</progress>
				</li>
			);
		});
	}
	return (
		<Page>
			<ContentPage>
				<div className={styles.tops}>
					<section>
						<h4>Top items</h4>
						<ul>{TopThreeItemsEl}</ul>
					</section>
					<section>
						<h4>Top Categories</h4>
						<ul>{TopTreeCatsEl}</ul>
					</section>
				</div>
				<section className={styles.summary}>
					<h4>Monthly Summary</h4>
					<ChartComp data={pcsPerMonth} />
				</section>
			</ContentPage>
			{!isMobile && (
				<SidePage>
					<ShoppingList reloadProvider={reloadProvider} />
				</SidePage>
			)}
		</Page>
	);
}
