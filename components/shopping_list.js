import styles from "./shopping_list.module.css";
import currentShoppingList from "../store/current_sl_context";
import { useContext, useState, useEffect } from "react";
import SlItem from "./cells/sl_item";
import axios from "axios";
import { ListStatus } from "@prisma/client";
import Confirmation from "./confirmation";

export default function ShoppingList({ setSidePageOpt, reloadProvider }) {
	const [state, setState] = useState("editing");
	const slContent = useContext(currentShoppingList);
	const [title, setTitle] = useState(slContent.name);
	const [newTitle, setNewTitle] = useState("");
	const [showCancelPrompt, setShowCancelPrompt] = useState(false);
	async function updateStatusCompleted() {
		const serverResponse = await axios.post(
			"/api/shopping_list/update_status",
			{
				newStatus: ListStatus.COMPLETED,
			}
		);
		if (serverResponse.data.data) {
			setState("editing");
			setShowCancelPrompt(false);
			reloadProvider();
		}
	}
	async function cancelList() {
		const serverResponse = await axios.post(
			"/api/shopping_list/update_status",
			{
				newStatus: ListStatus.CANCELED,
			}
		);
		if (serverResponse.data.data) {
			setState("editing");
			reloadProvider();
		}
	}
	function nameChangeHandler(ev) {
		setNewTitle(ev.target.value);
	}
	async function submitHandler() {
		const serverResponse = await axios.post("/api/shopping_list/update_label", {
			newLabel: newTitle,
		});
		if (serverResponse.data.data) {
			setNewTitle("");
			reloadProvider();
		}
	}
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
				return items.map((row) => (
					<li key={"sl-item-" + row.id}>
						<SlItem
							id={row.id}
							name={row.item.name}
							amount={row.itemAmount}
							itemStatus={row.item_status}
							reloadProvider={reloadProvider}
							state={state}
						/>
					</li>
				));
			};
			const tempEls = groupedCats.map((row) => (
				<section key={"sl-cat-sec" + row.name}>
					<h4 className={styles["cat-name"]}>{row.name}</h4>
					<ul>{getItemEls(row.items)}</ul>
				</section>
			));
			setItemEls({ content: tempEls });
			setTitle(slContent.name);
		}
	}, [slContent, state]);
	return (
		<section className={styles.base}>
			{showCancelPrompt && (
				<Confirmation
					textContent="Are you sure that you want to cancel this list?"
					onYes={cancelList}
					onCancel={() => {
						setShowCancelPrompt(false);
						setState("editing");
					}}
				/>
			)}
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
						<button onClick={() => setState("completing")}></button>
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
			{state === "editing" && (
				<div className={styles["title-form"]}>
					<form onSubmit={submitHandler}>
						<input
							type="text"
							placeholder="Enter a name"
							value={newTitle}
							onChange={nameChangeHandler}
						/>
						<input type="submit" value="Save" />
					</form>
				</div>
			)}
			{state === "completing" && (
				<div className={styles["title-form"]}>
					<div className={styles["bottom-wrapper"]}>
						<button onClick={() => setShowCancelPrompt(true)}>cancel</button>
						<button
							onClick={updateStatusCompleted}
							className={styles["btn-complete"]}
						>
							Complete
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
