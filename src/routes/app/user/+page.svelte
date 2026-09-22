<script lang="ts">
	import type { PageProps } from "./$types";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { Button } from "$lib/components/ui/button";
	import { KeyRound, LogOut, UserRoundKey, UserRoundPen } from "@lucide/svelte";
	import { changePassword } from "./userPanel.remote";

	let { data }: PageProps = $props();
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Passwort ändern</Card.Title>
		<Card.Description>Card Description</Card.Description>
	</Card.Header>
	<form {...changePassword}>
		<Card.Content class="mb-3 flex flex-col gap-3">
			<InputGroup.Root>
				<InputGroup.Addon>
					<UserRoundKey />
					Aktuelles Passwort
				</InputGroup.Addon>

				<InputGroup.Input {...changePassword.fields._current.as("password")} />
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._current.issues()?.[0].message}</span>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Neues Passwort
				</InputGroup.Addon>

				<InputGroup.Input {...changePassword.fields._new.as("password")} />
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._new.issues()?.[0].message}</span>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Passwort wiederholen
				</InputGroup.Addon>

				<InputGroup.Input {...changePassword.fields._repeat.as("password")} />
			</InputGroup.Root>
			<span class="text-destructive">{changePassword.fields._repeat.issues()?.[0].message}</span>
		</Card.Content>

		<Card.Footer class="flex gap-3 not-md:flex-col">
			<Button type="submit" class="not-md:w-full">
				<UserRoundPen />
				Passwort ändern
			</Button>

			<Button type="button" variant="outline" class="not-md:w-full">
				<LogOut />
				Alle Geräte abmelden
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
