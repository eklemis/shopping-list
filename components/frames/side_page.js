import styles from "./side_page.module.css";

export default function SidePage(props) {
	return <div className={styles.wrapper}>{props.children}</div>;
}
