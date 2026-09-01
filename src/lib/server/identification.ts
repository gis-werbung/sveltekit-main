import { getRequestEvent } from "$app/server";
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

export interface IdentBundle {
	loc: LocationData;
	locString: string;
	browser: string;
	date: string;
	proxy: string;
}

export async function getIdentBundle(): Promise<IdentBundle> {
	const { getClientAddress, request } = getRequestEvent();

	const loc = await getLocationData(getClientAddress());
	const locString = formatLocationData(loc);

	const browser = getBrowserInfo(request.headers.get("User-Agent"));
	const date = new Date().toLocaleString("de-DE");
	const proxy = loc.proxy ? "Ja" : "Nein";

	return { loc, locString, browser, date, proxy };
}

export function getIdentText(identBundle: IdentBundle) {
	return `
			Genauere Details:
			- Zeitpunkt: ${identBundle.date}
			- Ort: ${identBundle.locString}
			- Internetanbieter: ${identBundle.loc.isp}
			- VPN-Verdacht: ${identBundle.proxy}
			- Browser / Gerät: ${identBundle.browser}
			`;
}

export function getIdentHtml(identBundle: IdentBundle) {
	return /*html*/ `
			<p>Genauere Details:</p>
			<ul>
				<li>Zeitpunkt: ${identBundle.date}</li>
				<li>Ort: ${identBundle.locString}</li>
				<li>Internetanbieter: ${identBundle.loc.isp}</li>
				<li>VPN-Verdacht: ${identBundle.proxy}</li>
				<li>Browser / Gerät: ${identBundle.browser}</li>
			</ul>
			`;
}
