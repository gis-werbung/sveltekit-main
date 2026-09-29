<script lang="ts">
	import type { PageProps } from "./$types";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Button } from "$lib/components/ui/button";
	import { KeyRound, LogOut, UserRoundKey, UserRoundPen } from "@lucide/svelte";
	import { changePassword, logOutAll } from "./userPanel.remote";
	import { toast } from "svelte-sonner";

	let { data }: PageProps = $props();

	function doLogOut() {
		const promise = logOutAll();

		toast.promise(promise, {
			loading: "Alle anderen Sitzungen werden abgemeldet",
			success: "Alle anderen Sitzungen wurden abgemeldet",
			error: "Die Sitzungen konnten nicht abgemedet werden. Probiere es später nochmal"
		});
	}
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center gap-3">
			<UserRoundKey size="64" strokeWidth="1.25" class="text-muted-foreground" />
			<div>
				<Card.Title>Passwort ändern</Card.Title>
				<Card.Description>
					Solltest du dein Passwort vergessen haben, verwende "Passwort Vergessen" auf der
					Anmeldeseite
				</Card.Description>
			</div>
		</div>
	</Card.Header>

	<form {...changePassword}>
		<Card.Content class="mb-3 flex flex-col gap-3">
			<InputGroup.Root>
				<InputGroup.Addon>
					<UserRoundKey />
					Aktuelles Passwort
				</InputGroup.Addon>

				<InputGroup.Input
					{...changePassword.fields._current.as("password")}
					autocomplete="current-password"
				/>
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._current.issues()?.[0].message}</span>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Neues Passwort
				</InputGroup.Addon>

				<InputGroup.Input
					{...changePassword.fields._new.as("password")}
					autocomplete="new-password"
				/>
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._new.issues()?.[0].message}</span>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Passwort wiederholen
				</InputGroup.Addon>

				<InputGroup.Input
					{...changePassword.fields._repeat.as("password")}
					autocomplete="new-password"
				/>
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._repeat.issues()?.[0].message}</span>
		</Card.Content>

		<Card.Footer class="flex gap-3 not-md:flex-col">
			<Button type="submit" class="not-md:w-full">
				<UserRoundPen />
				Passwort ändern
			</Button>

			<Button type="button" variant="outline" class="not-md:w-full" onclick={doLogOut}>
				<LogOut />
				Alle Sitzungen abmelden
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
