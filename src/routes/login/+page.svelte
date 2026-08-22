<script lang="ts">
	import { login } from "./login.remote";
	import {
		Mail,
		KeyRound,
		EyeOff,
		Eye,
		UserRoundKey,
		UserRoundPlus,
		BadgeQuestionMark
	} from "@lucide/svelte";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";

	let checked = $state(false);
</script>

<svelte:head>
	<title>Anmelden | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<UserRoundKey size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Anmelden</Card.Title>
					<Card.Description>Gib deine E-Mail ein, um dich anzumelden</Card.Description>
				</div>
			</div>
		</Card.Header>

		<form {...login}>
			<Card.Content class="mb-3 flex flex-col gap-3">
				<span class="text-destructive">{login.fields.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<Mail />
						E-Mail
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="email"
						{...login.fields.email.as("email")}
						placeholder="max.mustermann@iserv-gis.de"
					/>
				</InputGroup.Root>
				<span class="text-destructive">{login.fields.email.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="current-password"
						{...login.fields._password.as("password")}
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
				<span class="text-destructive">{login.fields._password.issues()?.[0].message}</span>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" class="w-full">
					<UserRoundKey />
					Anmelden
				</Button>

				<ButtonGroup class="w-full">
					<Button variant="outline" href="/register" class="w-1/2">
						<UserRoundPlus />
						Registrieren
					</Button>

					<Button variant="outline" class="w-1/2">
						<BadgeQuestionMark />
						Passwort vergessen
					</Button>
				</ButtonGroup>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
