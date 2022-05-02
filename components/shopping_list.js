import styles from "./shopping_list.module.css";
import currentShoppingList from "../store/current_sl_context";
import { useContext, useState, useEffect } from "react";
import SlItem from "./cells/sl_item";

export default function ShoppingList({ setSidePageOpt }) {
	const slContent = useContext(currentShoppingList);
	const [title, setTitle] = useState(slContent.name);
	const [itemEls, setItemEls] = useState({
		content: [],
	});
	useEffect(() => {
		if (slContent) {
			const groupedCats = [];
			const groupByCat = (items) => {
				const tempCat = [];
				items.forEach((row) => {
					if (tempCat.indexOf(row.item.categories.name) === -1) {
						tempCat.push(row.item.categories.name);
						groupedCats.push({
							name: row.item.categories.name,
							items: items.filter(
								(_row) => _row.item.categories.name === row.item.categories.name
							),
						});
					}
				});
			};
			groupByCat(slContent.items);
			const getItemEls = (items) => {
				console.log(items);
				return items.map((row) => (
					<li key={"sl-item-" + row.id}>
						<SlItem id={row.id} name={row.item.name} amount={row.itemAmount} />
					</li>
				));
			};
			console.log("Grouped Cats:", groupedCats);
			const tempEls = groupedCats.map((row) => (
				<section key={"sl-cat-sec" + row.name}>
					<h4 className={styles["cat-name"]}>{row.name}</h4>
					<ul>{getItemEls(row.items)}</ul>
				</section>
			));
			setItemEls({ content: tempEls });
			setTitle(slContent.name);
		}
	}, [slContent]);
	return (
		<section className={styles.base}>
			<div className={styles["content-wrapper"]}>
				<div className={styles.head}>
					<div></div>
					<p>Didn’t find what you need?</p>
					<button
						onClick={() => {
							setSidePageOpt(1);
						}}
					>
						Add item
					</button>
				</div>
				{slContent.items.length > 0 && (
					<div className={styles["title-wrapper"]}>
						<h2>{title}</h2>
						<button></button>
					</div>
				)}
				{slContent.items.length === 0 && (
					<div className={styles.content}>
						<>
							<p className={styles["empty-text"]}>No items</p>
						</>
					</div>
				)}
				{slContent.items.length > 0 && (
					<div className={styles.content}>{itemEls.content}</div>
				)}
				{slContent.items.length === 0 && (
					<div className={styles["empty-decor"]}></div>
				)}
			</div>
			<div className={styles["title-form"]}>
				<form>
					<input type="text" placeholder="Enter a name" />
					<input type="submit" value="Save" />
				</form>
			</div>
		</section>
	);
}
