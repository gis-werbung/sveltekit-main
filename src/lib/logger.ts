import { configure, getConsoleSink } from "@logtape/logtape";
import { getTimeRotatingFileSink } from "@logtape/file";

await configure({
	sinks: {
		console: getConsoleSink(),
		file: getTimeRotatingFileSink({
			directory: "/var/gis-werbung/logs",
			filename: (date: Date) => `gis-werbung-${date.toISOString().slice(0, 10)}.log`
		})
	},
	loggers: [
		{ category: "gis-werbung", sinks: ["console", "file"] },
		{
			category: ["logtape", "meta"],
			sinks: ["console"],
			lowestLevel: "error"
		}
	]
});
