import footer from "./footer.txt?raw";
import footerHtml from "./footer.html.txt?raw";

import emailChanged from "./emailChanged.txt?raw";
import emailChangedHtml from "./emailChanged.html.txt?raw";
import passwordChanged from "./passwordChanged.txt?raw";
import passwordChangedHtml from "./passwordChanged.html.txt?raw";
import forgotPassword from "./forgotPassword.txt?raw";
import forgotPasswordHtml from "./forgotPassword.html.txt?raw";
import verifyEmail from "$lib/mails/verifyEmail.txt?raw";
import verifyEmailHtml from "$lib/mails/verifyEmail.html.txt?raw";

export interface MailBundle {
	html: string;
	text: string;
	subject: string;
	requiresIdentification: boolean;
}

export const EmailChanged: MailBundle = {
	subject: "Deine E-Mail-Addresse wurde geändert",
	html: emailChangedHtml,
	text: emailChanged,
	requiresIdentification: true
};

export const PasswordChanged: MailBundle = {
	subject: "Dein Passwort wurde geändert",
	html: passwordChangedHtml,
	text: passwordChanged,
	requiresIdentification: true
};

export const ForgotPassword: MailBundle = {
	subject: "Setze dein Passwort zurück",
	html: forgotPasswordHtml,
	text: forgotPassword,
	requiresIdentification: false
};

export const VerifyEmail: MailBundle = {
	subject: "Bestätige deine E-Mail",
	html: verifyEmailHtml,
	text: verifyEmail,
	requiresIdentification: false
};

export { footer, footerHtml };
