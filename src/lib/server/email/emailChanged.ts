import { EmailChanged, PasswordChanged } from "$lib/mails";
import { assembleEmail } from "$lib/server/email";

export async function sendEmailChangedEmail(user: DBTypes.OpenUser, oldEmail: string) {
	const sendEmail = await assembleEmail(EmailChanged, user);

	try {
		await sendEmail(oldEmail);
	} catch {
		throw new Error("Failed to send email");
	}
}

export async function sendPasswordChangedEmail(user: DBTypes.OpenUser) {
	const sendEmail = await assembleEmail(PasswordChanged, user);

	try {
		await sendEmail();
	} catch {
		throw new Error("Failed to send email");
	}
}
