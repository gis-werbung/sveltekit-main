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

export async function getLocationData(ip: string): Promise<LocationData | undefined> {
	console.log("GetLoc for", ip);

	if (ip === "::1" || ip === "127.0.0.1")
		return {
			continent: "Hier-Platte",
			country: "Lokal-Land",
			city: "Loopback-Hausen",
			isp: "Wendeschleifen GmbH",
			proxy: false,
			regionName: "Schlareifen-Land",
			status: "success"
		};

	const response = await fetch(`http://ip-api.com/json/${ip}?lang=de&fields=1196569`);
	const json = await response.json();

	if (json.status !== "success") return;

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
	loc?: LocationData;
	locString?: string;
	browser: string;
	date: string;
	proxy?: string;
}

export async function getIdentBundle(): Promise<IdentBundle> {
	const { getClientAddress, request } = getRequestEvent();

	const loc = await getLocationData(getClientAddress());

	const locString = loc && formatLocationData(loc);
	const proxy = loc && (loc.proxy ? "Ja" : "Nein");

	const browser = getBrowserInfo(request.headers.get("User-Agent"));
	const date = new Date().toLocaleString("de-DE");

	return { loc, locString, browser, date, proxy };
}

export function getIdentText(identBundle: IdentBundle) {
	return `
			Genauere Details:
			- Zeitpunkt: ${identBundle.date}
			- Ort: ${identBundle.locString ?? "Unbekannt"}
			- Internetanbieter: ${identBundle.loc?.isp ?? "Unbekannt"}
			- VPN-Verdacht: ${identBundle.proxy ?? "Unbekannt"}
			- Browser / Gerät: ${identBundle.browser}
			`;
}

export function getIdentHtml(identBundle: IdentBundle) {
	return /*html*/ `
			<p>Genauere Details:</p>
			<ul>
				<li>Zeitpunkt: ${identBundle.date}</li>
				<li>Ort: ${identBundle.locString ?? "Unbekannt"}</li>
				<li>Internetanbieter: ${identBundle.loc?.isp ?? "Unbekannt"}</li>
				<li>VPN-Verdacht: ${identBundle.proxy ?? "Unbekannt"}</li>
				<li>Browser / Gerät: ${identBundle.browser}</li>
			</ul>
			`;
}
