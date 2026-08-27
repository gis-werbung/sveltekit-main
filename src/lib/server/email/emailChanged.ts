import { EmailChanged } from "$lib/mails";
import { assembleEmail } from "$lib/server/email";

export async function sendEmailChangedEmail(user: DBTypes.OpenUser, oldEmail: string) {
	const sendEmail = assembleEmail(EmailChanged, user);

	try {
		await sendEmail(oldEmail);
	} catch {
		throw new Error("Failed to send email");
	}
}
