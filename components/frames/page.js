import styles from "./page.module.css";

export default function Page(props) {
	return <section className={styles.page}>{props.children}</section>;
}
