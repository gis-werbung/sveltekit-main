<script lang="ts">
	import { resetPassword } from "./resetPassword.remote";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import { Eye, EyeOff, KeyRound, PencilLine } from "@lucide/svelte";

	let checked = $state(false);
</script>

<svelte:head>
	<title>Passwort zurücksetzen | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<KeyRound size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Passwort zurücksetzen</Card.Title>
					<Card.Description>Wähle ein neues Passwort für dein Konto</Card.Description>
				</div>
			</div>
		</Card.Header>

		<form {...resetPassword}>
			<Card.Content class="mb-3 flex flex-col gap-3">
				<span class="text-destructive">{resetPassword.fields.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="new-password"
						{...resetPassword.fields._password.as("password")}
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
				<span class="text-destructive">{resetPassword.fields._password.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<KeyRound />
						Passwort wiederholen
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="new-password"
						{...resetPassword.fields._repeatPassword.as("password")}
						type={checked ? "text" : "password"}
					/>
				</InputGroup.Root>
				<span class="text-destructive">
					{resetPassword.fields._repeatPassword.issues()?.[0].message}
				</span>
			</Card.Content>

			<Card.Footer>
				<Button type="submit" class="w-full">
					<PencilLine />
					Passwort ändern
				</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
