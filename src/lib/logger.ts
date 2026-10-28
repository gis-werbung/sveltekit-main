import { dev } from "$app/env";
import { configure, getConsoleSink } from "@logtape/logtape";
import { getTimeRotatingFileSink } from "@logtape/file";

export function configureLogger() {
	return configure({
		sinks: {
			console: getConsoleSink(),
			file: getTimeRotatingFileSink({
				directory: dev ? "./dev-logs" : "/var/gis-werbung/logs",
				filename: (date) => `gis-werbung-${date.toISOString().slice(0, 10)}.log`
			})
		},
		// Only allow resetting on dev servers
		reset: dev,
		loggers: [
			{ category: "gis-werbung", sinks: ["console", "file"] },
			{
				category: ["logtape", "meta"],
				sinks: ["console"],
				lowestLevel: "error"
			}
		]
	});
}
