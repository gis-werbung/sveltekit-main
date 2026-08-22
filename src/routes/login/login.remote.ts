import { form } from "$app/server";
import * as v from "valibot";

export const login = form(
	v.object({
		email: v.pipe(
			v.string(),
			v.nonEmpty("Bitte gib eine E-Mail an"),
			v.email("Bitte gib eine gültige E-Mail an"),
			v.endsWith(
				"iserv-gis.de",
				"Derzeit erlauben wir nur Registrationen mit schulinternen E-Mail-Adressen"
			)
		),
		_password: v.pipe(v.string(), v.nonEmpty("Bitte gib ein Password ein"))
	}),
	async (data) => {
		// TODO: Implement
		return new Error("Not implemented");
	}
);
