import styles from "./item_detail.module.css";
import Image from "next/image";
import Confirmation from "./confirmation";
import { useState } from "react";

export default function ItemDetail({
	setSidePageOpt,
	id,
	image,
	name,
	category,
	note,
	addSLItem,
}) {
	const [confirmShow, setConfirmShow] = useState(false);
	function proceedDelete() {
		//send deletion request
		//hide back the confirmation
		setConfirmShow(false);
	}
	function cancelDelete() {
		setConfirmShow(false);
	}
	return (
		<section className={styles.base}>
			{confirmShow && (
				<Confirmation
					textContent="Are you sure that you want to delete this item?"
					onYes={proceedDelete}
					onCancel={cancelDelete}
				/>
			)}
			<a
				href="#"
				onClick={() => {
					setSidePageOpt(0);
				}}
			>
				back
			</a>

			<div className={styles["image-holder"]}>
				<Image
					src={image}
					layout="fill"
					objectFit="cover"
					placeholder="blur"
					blurDataURL="/images/blured.jpg"
					alt={name + " image"}
					priority
				/>
			</div>
			<span>name</span>
			<p>{name}</p>
			<span>category</span>
			<p>{category}</p>
			<span>note</span>
			<p>{note}</p>
			<div className={styles["actions"]}>
				<button className={styles.delete} onClick={() => setConfirmShow(true)}>
					delete
				</button>
				<button
					className={styles.add}
					onClick={() => {
						addSLItem(id);
						setSidePageOpt(0);
					}}
				>
					Add to list
				</button>
			</div>
		</section>
	);
}
