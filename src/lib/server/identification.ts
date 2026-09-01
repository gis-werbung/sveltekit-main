import { parse } from "useragent";

interface LocationData {
	status: "success" | "fail";
	continent: string;
	country: string;
	regionName: string;
	city: string;
	isp: string;
	proxy: boolean;
}

export async function getLocationData(ip: string): Promise<LocationData> {
	const response = await fetch(`http://ip-api.com/json/${ip}?lang=de&fields=1196569`);
	const json = await response.json();

	if (json.status !== "success") throw new Error("Failed to obtain Location");

	return json;
}

export function formatLocationData(loc: LocationData) {
	const array = [loc.city, loc.regionName, loc.country, loc.continent].filter(Boolean);
	return array.join(", ");
}

export function getBrowserInfo(useragent: string | null) {
	if (!useragent) return "Genaueres dazu konnte nicht ermittelt werden";

	const data = parse(useragent);

	return data.toString().replaceAll(" 0.0.0", "");
}
