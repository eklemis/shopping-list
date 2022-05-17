import {
	LineChart,
	Line,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
} from "recharts";
import isMobileScreen from "../../store/screen_context";
import { useContext, useEffect } from "react";
export default function ChartComp({ data }) {
	const isMobile = useContext(isMobileScreen);
	let defWidth = 600;
	let defHeight = 300;
	if (isMobile) {
		defWidth = 280;
		defHeight = 250;
	}
	return (
		<LineChart
			width={defWidth}
			height={defHeight}
			data={data}
			margin={{ top: 5, right: 20, bottom: 5, left: -22 }}
		>
			<Line type="monotone" dataKey="itemCount" stroke="#F9A109" />
			<CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
		</LineChart>
	);
}
