import footer from "./footer.txt?raw";
import footerHtml from "./footer.html.txt?raw";

import emailChanged from "./emailChanged.txt?raw";
import emailChangedHtml from "./emailChanged.html.txt?raw";
import forgotPassword from "./forgotPassword.txt?raw";
import forgotPasswordHtml from "./forgotPassword.html.txt?raw";
import verifyEmail from "$lib/mails/verifyEmail.txt?raw";
import verifyEmailHtml from "$lib/mails/verifyEmail.html.txt?raw";

export interface MailBundle {
	html: string;
	text: string;
	subject: string;
}

export const EmailChanged: MailBundle = {
	subject: "Deine E-Mail-Addresse wurde geändert",
	html: emailChangedHtml,
	text: emailChanged
};
export const ForgotPassword: MailBundle = {
	subject: "Setze dein Passwort zurück",
	html: forgotPasswordHtml,
	text: forgotPassword
};
export const VerifyEmail: MailBundle = {
	subject: "Bestätige deine E-Mail",
	html: verifyEmailHtml,
	text: verifyEmail
};

export { footer, footerHtml };
