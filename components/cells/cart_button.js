import { useContext } from "react";
import currentShoppingList from "../../store/current_sl_context";
import styles from "./cart_button.module.css";

export default function CartButton({ setInitialOpt }) {
	const shopList = useContext(currentShoppingList);
	return (
		<button className={styles.wrapper} onClick={() => setInitialOpt(0)}>
			<span className={styles.number}>{shopList.items.length}</span>
		</button>
	);
}
