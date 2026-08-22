import { form } from "$app/server";
import * as v from "valibot";

export const login = form(
	v.object({
		name: v.pipe(v.string(), v.nonEmpty("Bitte gib deinen Namen an")),
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an"),
			v.check(
				(data) => data.split("@")[1] === "iserv-gis.de",
				"Derzeit erlauben wir nur Registrationen mit schulinternen E-Mail-Adressen"
			)
		),
		_password: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib ein Password ein"),
			v.minLength(8, "Dein Password muss mindestens 8 Zeichen haben")
		)
	}),
	async (data) => {
		// TODO: Implement
		return new Error("Not implemented");
	}
);
