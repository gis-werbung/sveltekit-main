<script lang="ts">
	import { register } from "./register.remote";
	import {
		Eye,
		EyeOff,
		KeyRound,
		Mail,
		UserRound,
		UserRoundKey,
		UserRoundPlus
	} from "@lucide/svelte";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";

	let checked = $state(false);
</script>

<svelte:head>
	<title>Registrieren | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<UserRoundPlus size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Ein Konto erstellen</Card.Title>
					<Card.Description>Gib deine Daten ein, um dein Konto anzulegen</Card.Description>
				</div>
			</div>
		</Card.Header>

		<form {...register}>
			<Card.Content class="mb-3 flex flex-col gap-3">
				<span class="text-destructive">{register.fields.issues()?.[0].message}</span>

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
				<span class="text-destructive">{register.fields.name.issues()?.[0].message}</span>

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
				<span class="text-destructive">{register.fields.email.issues()?.[0].message}</span>

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
				<span class="text-destructive">{register.fields._password.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort wiederholen
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="new-password"
						{...register.fields._repeatPassword.as("password")}
						type={checked ? "text" : "password"}
					/>
				</InputGroup.Root>
				<span class="text-destructive">{register.fields._repeatPassword.issues()?.[0].message}</span
				>
			</Card.Content>
			<Card.Footer class="flex-col gap-2">
				<Button type="submit" class="w-full">
					<UserRoundPlus />
					Konto erstellen
				</Button>

				<Button variant="outline" href="/login" class="w-full">
					<UserRoundKey />
					Ich habe bereits ein Konto
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
