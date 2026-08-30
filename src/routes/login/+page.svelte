<script lang="ts">
	import { login, resetPassword } from "./login.remote";
	import {
		Mail,
		KeyRound,
		EyeOff,
		Eye,
		UserRoundKey,
		UserRoundPlus,
		BadgeQuestionMark,
		X,
		SendHorizontal
	} from "@lucide/svelte";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { GenericDialog } from "$lib/components/Reactivity.svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { toast } from "svelte-sonner";

	let checked = $state(false);
	let isForgotOpen = $state(false);
</script>

<svelte:head>
	<title>Anmelden | GiS Werbung</title>
</svelte:head>

<GenericDialog.Root bind:open={isForgotOpen}>
	<GenericDialog.Content class="sm:max-w-sm">
		<form
			{...resetPassword.enhance(async (form) => {
				const promise = form.submit();
				promise.then(() => {
					isForgotOpen = false;
				});

				toast.promise(promise, {
					success: "Eine E-Mail mit einem Zurücksetzungslink wurde gesendet",
					error: "Die E-Mail konnte nicht gesendet werden. Probiere es später nochmal"
				});
			})}
			class="mx-auto w-full max-w-md not-sm:px-4 not-sm:*:px-0! sm:contents"
		>
			<GenericDialog.Header>
				<GenericDialog.Title>Passwort vergessen?</GenericDialog.Title>
				<GenericDialog.Description>
					Schicke dir einen Link zum Zurücksetzen zu
				</GenericDialog.Description>
			</GenericDialog.Header>

			<div class="flex flex-col gap-3">
				<InputGroup.Root>
					<InputGroup.Addon>
						<Mail />
						E-Mail
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="email"
						placeholder="mathilda.musterfrau@iserv-gis.de"
						{...resetPassword.fields.email.as("email")}
					/>
				</InputGroup.Root>
				<span class="text-destructive">{resetPassword.fields.email.issues()?.[0].message}</span>
			</div>

			<GenericDialog.Footer>
				<GenericDialog.Close type="button" class={buttonVariants({ variant: "outline" })}>
					<X />
					Abbrechen
				</GenericDialog.Close>

				<Button type="submit">
					<SendHorizontal />
					Änderungen übernehmen
				</Button>
			</GenericDialog.Footer>
		</form>
	</GenericDialog.Content>
</GenericDialog.Root>

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

				<div class="grid w-full grid-cols-2 gap-2">
					<Button variant="outline" href="/register">
						<UserRoundPlus />
						Registrieren
					</Button>

					<Button variant="outline" onclick={() => (isForgotOpen = true)}>
						<BadgeQuestionMark />
						Passwort vergessen
					</Button>
				</div>
			</Card.Footer>
		</form>
	</Card.Root>
</div>
