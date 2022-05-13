import styles from "./sl_item.module.css";
import axios from "axios";
import { ListItemStatus } from "@prisma/client";
export default function SlItem({
	id,
	name,
	amount,
	itemStatus,
	reloadProvider,
	state,
}) {
	console.log("id: ", id, "status: ", itemStatus);
	const delHandler = async () => {
		const serverResponse = await axios.post("/api/shopping_list/remove_item", {
			itemId: id,
		});

		if (serverResponse.data.data) {
			reloadProvider();
		}
	};
	const incHandler = async () => {
		const serverResponse = await axios.post(
			"/api/shopping_list/inc_item_amount",
			{
				itemId: id,
			}
		);
		if (serverResponse.data.data) {
			reloadProvider();
		}
	};
	const decHandler = async () => {
		console.log("req id:", id);
		const serverResponse = await axios.post(
			"/api/shopping_list/dec_item_amount",
			{
				itemId: id,
			}
		);
		console.log("dec response:", serverResponse);
		if (serverResponse.data.data) {
			reloadProvider();
		}
	};
	const changeStatusHandler = async () => {
		console.log("req id:", id);
		const serverResponse = await axios.post(
			"/api/shopping_list/switch_item_status",
			{
				itemId: id,
			}
		);
		console.log("switch api response:", serverResponse);
		if (serverResponse.data.data) {
			reloadProvider();
		}
	};
	return (
		<div className={styles.liner}>
			<div className={styles["hor-wrapper"]}>
				{state === "completing" && (
					<button
						className={
							itemStatus === ListItemStatus.COMPLETED
								? styles["item-completed"]
								: styles["item-active"]
						}
						onClick={changeStatusHandler}
					></button>
				)}
				<p>{name}</p>
			</div>
			<div className={styles.sub}>
				<button onClick={delHandler}></button>
				<button onClick={decHandler}></button>
				<span>{amount} pcs</span>
				<button onClick={incHandler}></button>
			</div>
		</div>
	);
}
