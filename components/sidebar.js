import styles from "./sidebar.module.css";
import CartButton from "./cells/cart_button";
import Logo from "./cells/logo";

export default function SideBar({ activeMenu, setActiveMenu, setSidePageOpt }) {
	return (
		<div className={styles.wrapper}>
			<Logo />
			<ul className={styles.menu}>
				<li>
					<button
						className={activeMenu === 0 ? styles.active : undefined}
						onClick={() => setActiveMenu(0)}
					></button>
					<span>items</span>
				</li>
				<li>
					<button
						className={activeMenu === 1 ? styles.active : undefined}
						onClick={() => setActiveMenu(1)}
					></button>
					<span>history</span>
				</li>
				<li>
					<button
						className={activeMenu === 2 ? styles.active : undefined}
						onClick={() => setActiveMenu(2)}
					></button>
					<span>statistics</span>
				</li>
			</ul>
			<CartButton
				setSidePageOpt={setSidePageOpt}
				setActiveMenu={setActiveMenu}
			/>
		</div>
	);
}
