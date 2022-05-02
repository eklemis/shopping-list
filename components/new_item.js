import styles from "./new_item.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";

function isValidURL(string) {
	var res = string.match(
		/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
	);
	return res !== null;
}
function validImageUrl(url) {
	if (!isValidURL(url)) return false;
	console.log("Sending request to:", url);
	const request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.send();
	request.onload = function () {
		const contentType = request.getResponseHeader("Content-Type").split("/")[0];
		console.log("got content type: ", contentType);
		if (request.status == 200 && contentType === "image") {
			return true;
		}
		return false;
	};
}
export default function NewItem({ setSidePageOpt }) {
	const [latestCats, setLatestCats] = useState("");
	let [catOptions, setCatOptions] = useState({ optionEls: [] });
	useEffect(() => {
		console.log("cats:", latestCats);
		if (latestCats && latestCats !== null) {
			const optionEls = latestCats.data.map((cat) => (
				<option key={"catOpt-" + cat.id} value={cat.name} />
			));
			setCatOptions({ optionEls: optionEls });
		}
	}, [latestCats]);
	useEffect(() => {
		axios.get("/api/category/get_all").then((response) => {
			setLatestCats(response.data);
		});
	}, []);
	const [errMessage, setErrMessage] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		note: "",
		image: "",
		category: "",
	});
	const { mutate } = useSWRConfig();
	function changeHandler(ev) {
		let newFormData = { ...formData };
		newFormData[ev.target.name] = ev.target.value;
		setFormData({ ...newFormData });
	}
	async function SubmitHandler(ev) {
		ev.preventDefault();
		console.log("Submit requested!");
		if (
			formData.name.trim() === "" ||
			formData.category.trim === "" ||
			formData.image.trim() === ""
		) {
			setErrMessage("Please fill all required field!");
			return;
		}
		if (!validImageUrl) {
			setErrMessage("Image url is not valid");
			return;
		}
		setErrMessage("");
		const postData = {
			name: formData.name.trim(),
			note: formData.note.trim(),
			image: formData.image.trim(),
			category: formData.category.trim(),
		};
		const resp = await fetch("/api/items/new_item", {
			method: "POST",
			body: JSON.stringify({ ...postData }),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const serverData = await resp.json();

		mutate("/api/items/get_all");
		if (serverData.error) {
			setErrMessage(serverData.message, ":", serverData.error);
		}
		console.log("Client received", serverData);
		setSidePageOpt(0);
	}
	return (
		<section className={styles.base}>
			<h2>Add a new item</h2>
			<form onSubmit={SubmitHandler}>
				<label htmlFor="name">Name</label>
				<input type="text" name="name" id="name" onChange={changeHandler} />
				<label htmlFor="note">Note (optional)</label>
				<textarea
					name="note"
					id="note"
					rows="3"
					cols="30"
					onChange={changeHandler}
				/>
				<label htmlFor="image">Image</label>
				<input type="text" name="image" id="image" onChange={changeHandler} />
				<label htmlFor="category">Category</label>
				<input list="catopt" name="category" onChange={changeHandler} />
				<datalist id="catopt" name="catopt">
					{catOptions.optionEls}
				</datalist>
				<p>{errMessage}</p>
				<div className={styles.action}>
					<input
						type="button"
						value="cancel"
						onClick={() => {
							setSidePageOpt(0);
						}}
					/>
					<input type="submit" value="Save" />
				</div>
			</form>
		</section>
	);
}
