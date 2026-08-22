<script lang="ts">
	import { register } from "./register.remote";
	import { Eye, EyeOff, KeyRound, Mail, UserRound, UserRoundPlus } from "@lucide/svelte";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";

	let checked = $state(false);
</script>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2">
	<Card.Root>
		<Card.Header>
			<Card.Title>Ein Konto erstellen</Card.Title>
			<Card.Description>Geben Sie ihre Daten an, um sich ein Konto anzulegen</Card.Description>
		</Card.Header>

		<Card.Content>
			<form class="flex flex-col gap-3">
				<InputGroup.Root>
					<InputGroup.Addon>
						<UserRound />
						Name
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="name"
						{...register.fields.name.as("text")}
						placeholder="Max Mustermann"
					/>
				</InputGroup.Root>

				<InputGroup.Root>
					<InputGroup.Addon>
						<Mail />
						E-Mail
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="email"
						{...register.fields.email.as("email")}
						placeholder="max.mustermann@iserv-gis.de"
					/>
				</InputGroup.Root>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="new-password"
						{...register.fields._password.as("password")}
						type={checked ? "text" : "password"}
					/>

					<InputGroup.Addon align="inline-end">
						<InputGroup.Button
							aria-label="Passwort anzeigen"
							size="icon-xs"
							onclick={() => (checked = !checked)}
						>
							{#if checked}
								<EyeOff />
							{:else}
								<Eye />
							{/if}
						</InputGroup.Button>
					</InputGroup.Addon>
				</InputGroup.Root>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort wiederholen
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="new-password"
						{...register.fields._password.as("password")}
						type={checked ? "text" : "password"}
					/>
				</InputGroup.Root>
			</form>
		</Card.Content>
		<Card.Footer class="flex-col gap-2">
			<Button type="submit" class="w-full">
				<UserRoundPlus />
				Konto erstellen
			</Button>

			<Button variant="outline" href="/login" class="w-full">Ich habe bereits ein Konto</Button>
		</Card.Footer>
	</Card.Root>
</div>
