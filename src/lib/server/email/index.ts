import * as mails from "$lib/mails";
import { env } from "$env/dynamic/private";
import { createTransport } from "nodemailer";
import { getRequestEvent } from "$app/server";
import { formatLocationData, getBrowserInfo, getLocationData } from "../identification";

if (!env.SITE_HOME_URL) throw new Error("SITE_HOME_URL is not set");
if (!env.SMTP_HOST) throw new Error("SMTP_HOST is not set");
if (!env.SMTP_PASS) throw new Error("SMTP_PASS is not set");
if (!env.SMTP_USER) throw new Error("SMTP_USER is not set");

const emailTransport = createTransport({
	host: env.SMTP_HOST,
	port: 465,
	secure: true,
	auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
});

export function constructUrl(pathname: string) {
	return env.SITE_HOME_URL + pathname;
}

/**
 * Assembles an email and returns the send function
 * @param bundle The email bundle (from $lib/mails)
 * @param user The targetted user
 * @param vars Additional replacement values
 * @returns The function to send the email
 *
 * Example:
 * ```
 * import { EmailChanged } from "$lib/mails";
 *
 * const sendEmail = assembleEmail(EmailChanged, user);
 * await sendEmail();
 * ```
 */
export async function assembleEmail(
	bundle: mails.MailBundle,
	user: DBTypes.OpenUser,
	vars: Record<string, string> = {}
) {
	let text = bundle.text.replace("%footer%", mails.footer);
	let html = bundle.html.replace("%footer%", mails.footerHtml);

	vars["name"] = user.name;

	for (const filter of Object.entries(vars)) {
		text = text.replaceAll(...filter);
		html = html.replaceAll(...filter);
	}

	if (bundle.requiresIdentification) {
		const { getClientAddress, request } = getRequestEvent();

		const loc = await getLocationData(getClientAddress());
		const locString = formatLocationData(loc);

		const browser = getBrowserInfo(request.headers.get("User-Agent"));
		const date = new Date().toLocaleString("de-DE");
		const proxyString = loc.proxy ? "Ja" : "Nein";

		const identificationText = `
			Genauere Details:
			- Zeitpunkt: ${date}
			- Ort: ${locString}
			- Internetanbieter: ${loc.isp}
			- VPN-Verdacht: ${proxyString}
			- Browser / Gerät: ${browser}
			`;

		const identificationHtml = /*html*/ `
			<p>Genauere Details:</p>
			<ul>
				<li>Zeitpunkt: ${date}</li>
				<li>Ort: ${locString}</li>
				<li>Internetanbieter: ${loc.isp}</li>
				<li>VPN-Verdacht: ${proxyString}</li>
				<li>Browser / Gerät: ${browser}</li>
			</ul>
			`;

		text = text.replace("%identification%", identificationText);
		html = html.replace("%identification%", identificationHtml);
	}

	return (forceEmail?: string) =>
		emailTransport.sendMail({
			from: '"GiS Werbung" <noreply@gis-werbung.de>',
			to: forceEmail ?? user.email,
			subject: bundle.subject,
			html,
			text
		});
}
