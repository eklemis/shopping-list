import styles from "./content_page.module.css";

export default function ContentPage(props) {
	return <div className={styles.wrapper}>{props.children}</div>;
}
