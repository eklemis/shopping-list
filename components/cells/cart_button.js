import { useContext } from "react";
import currentShoppingList from "../../store/current_sl_context";
import styles from "./cart_button.module.css";
import isMobileScreen from "../../store/screen_context";

export default function CartButton({ setInitialOpt, setActiveMenu }) {
	const shopList = useContext(currentShoppingList);
	const isMobile = useContext(isMobileScreen);
	return (
		<button
			className={styles.wrapper}
			onClick={() => {
				if (isMobile) setActiveMenu(3);
			}}
		>
			<span className={styles.number}>{shopList.items.length}</span>
		</button>
	);
}
