import styles from "./confirmation.module.css";

export default function Confirmation({
	textContent,
	onYes,
	onYesParams,
	onCancel,
	onCancelParams,
}) {
	return (
		<>
			<div className={styles.backdrop}></div>
			<div className={styles.content}>
				<button className={styles.close} onClick={onCancel}></button>
				<p>{textContent}</p>
				<div className={styles["bottom-wrapper"]}>
					<button
						className={styles.cancel}
						onClick={() => onCancel(onCancelParams && { ...onCancelParams })}
					>
						cancel
					</button>
					<button
						className={styles.yes}
						onClick={() => onYes(onYesParams && { ...onYesParams })}
					>
						Yes
					</button>
				</div>
			</div>
		</>
	);
}
