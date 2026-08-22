import { form } from "$app/server";
import * as v from "valibot";

export const register = form(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty("Bitte gib deinen Namen an")),
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an"),
			v.endsWith(
				"iserv-gis.de",
				"Derzeit erlauben wir nur Registrationen mit schulinternen E-Mail-Adressen"
			)
		),
		_password: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib ein Password ein"),
			v.minLength(8, "Dein Password muss mindestens 8 Zeichen haben")
		),
		_repeatPassword: v.pipe(v.string(), v.nonEmpty("Bitte gib das Password erneut ein"))
	}),
	async (data) => {
		// TODO: Implement
		throw new Error("Not implemented");
	}
);
