import { useState } from "react";
import styles from "./sl_item.module.css";
export default function SlItem({ id, name, amount }) {
	const [state, setState] = useState(0); //0: default, 1: expanded
	return (
		<div className={styles.liner}>
			<p>{name}</p>
			<div className={styles.sub}>
				<button></button>
				<button></button>
				<span>{amount} pcs</span>
				<button></button>
			</div>
		</div>
	);
}
