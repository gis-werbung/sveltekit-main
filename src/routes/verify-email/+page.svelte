<script lang="ts">
	import { resendEmailCode, changeEmail } from "./verify-email.remote";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Dialog from "$lib/components/ui/dialog/index.js";
	import * as Drawer from "$lib/components/ui/drawer/index.js";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import * as Alert from "$lib/components/ui/alert/index.js";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import { Info, Mail, MailSearch, PencilLine, SendHorizontal, X } from "@lucide/svelte";
	import { Countdown } from "$lib/components/Countdown.svelte";
	import { toast } from "svelte-sonner";
	import { onDestroy, onMount, tick } from "svelte";
	import { Spinner } from "$lib/components/ui/spinner";
	import { MediaQuery } from "svelte/reactivity";
	import { replaceState } from "$app/navigation";
	import type { PageProps } from "./$types";
	import { isHttpError } from "@sveltejs/kit";

	async function resend() {
		const result = resendEmailCode();

		toast.promise(result, {
			loading: "Deine E-Mail wird gesendet",
			success: "Deine E-Mail wurde gesendet",
			error: "Deine E-Mail konnte leider nicht gesendet werden. Probiere es später nochmal"
		});

		countdown.setSeconds(30);
	}

	const { data }: PageProps = $props();
	const countdown = new Countdown(15);
	let isChangeOpen = $state(false);

	const large = new MediaQuery("min-width: 40rem");
	const GenericDialog = $derived(large.current ? Dialog : Drawer);

	onDestroy(() => {
		countdown.stopCountdown();
	});

	onMount(async () => {
		const urlParams = new URLSearchParams(window.location.search);
		if (urlParams.size === 0) return;

		if (urlParams.has("errored")) {
			toast.error(
				"Deine E-Mail konnte bei der Registration leider nicht gesendet werden. Probiere es später nochmal"
			);
		}

		await tick();
		replaceState(window.location.pathname, {});
	});
</script>

<svelte:head>
	<title>E-Mail verifizieren | GiS Werbung</title>
</svelte:head>

<GenericDialog.Root bind:open={isChangeOpen}>
	<GenericDialog.Content class="sm:max-w-xl">
		<form
			{...changeEmail.enhance(async (form) => {
				const email = form.fields.email.value()!;
				try {
					if (await form.submit()) {
						form.element.reset();
						isChangeOpen = false;
						toast.success("Deine E-Mail-Addresse wurde geändert und eine neue E-Mail verschickt");
						data.email = email;
					}
				} catch (e) {
					if (isHttpError(e) && e.body.message === "Failed to send E-Mail") {
						toast.warning(
							"Zwar konnte deine E-Mail-Addresse geändert werden, jedoch konnte keine E-Mail verschickt werden. Probiere es später nochmal"
						);
						data.email = email;
					} else {
						toast.error(
							"Die Anfrage konnte vom Server nicht verarbeitet werden. Probiere es später nochmal"
						);
					}
				}
			})}
			class="mx-auto w-full max-w-md not-sm:px-4 not-sm:*:px-0! sm:contents"
		>
			<GenericDialog.Header>
				<GenericDialog.Title>E-Mail-Addresse ändern</GenericDialog.Title>
				<GenericDialog.Description>
					Solltest du deine E-Mail-Addresse falsch angegeben haben, kannst du sie jetzt ändern
				</GenericDialog.Description>
			</GenericDialog.Header>

			<div class="flex flex-col gap-3">
				<Alert.Root>
					<Info />
					<Alert.Title>Aktuelle E-Mail-Addresse:</Alert.Title>
					<Alert.Description>{data.email}</Alert.Description>
				</Alert.Root>

				<InputGroup.Root>
					<InputGroup.Addon>
						<Mail />
						E-Mail
					</InputGroup.Addon>

					<InputGroup.Input
						autocomplete="email"
						placeholder="mathilda.musterfrau@iserv-gis.de"
						{...changeEmail.fields.email.as("email")}
					/>
				</InputGroup.Root>
				<span class="text-destructive">{changeEmail.fields.email.issues()?.[0].message}</span>
			</div>

			<GenericDialog.Footer>
				<GenericDialog.Close type="button" class={buttonVariants({ variant: "outline" })}>
					<X />
					Abbrechen
				</GenericDialog.Close>

				<!-- "tabular-nums" sorgt dafür, dass Zahlen eine feste breite haben,
				 sodass der Knopf beim Countdown nicht die ganze Zeit größer und kleiner wird -->
				<Button type="submit" disabled={countdown.seconds > 0} class="tabular-nums">
					{#if countdown.seconds > 0}
						<Spinner />
						{#if large.current}
							Änderungen übernehmen (Warte noch {countdown.seconds} Sekunde{#if countdown.seconds !== 1}n{/if})
						{:else}
							Warte noch {countdown.seconds} Sekunde{#if countdown.seconds !== 1}n{/if}
						{/if}
					{:else}
						<PencilLine />
						Änderungen übernehmen
					{/if}
				</Button>
			</GenericDialog.Footer>
		</form>
	</GenericDialog.Content>
</GenericDialog.Root>

<div class="absolute top-1/2 left-1/2 w-xl -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<MailSearch size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Bestätige deine E-Mail</Card.Title>
					<Card.Description>
						Um Missbrauch vorzubeugen, bitten wir dich deine E-Mail-Adresse zu bestätigen
					</Card.Description>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="mb-3 flex flex-col gap-3">
			<Alert.Root>
				<Info />
				<Alert.Title>Aktuelle E-Mail-Addresse:</Alert.Title>
				<Alert.Description>{data.email}</Alert.Description>
			</Alert.Root>

			<span>Eine E-Mail sollte bereits zu deinem E-Mail-Postfach gesendet worden sein.</span>
			<span>Solltest du sie nicht finden tue bitte folgendes</span>
			<ul class="list-disc pl-6">
				<li>Schaue in deinem Spam-Ordner nach</li>
				<li>
					Gucke, ob deine E-Mail im Konto richtig angegeben ist. Solange sie nicht verifiziert ist,
					kannst du sie ohne Probleme ändern
				</li>
				<li>
					Gucke auch, ob irgendwelche Einstellungen oder Filter, die E-Mail verschluckt haben
					könnten
				</li>
				<li>Sende dir eine weitere zu</li>
			</ul>
		</Card.Content>

		<Card.Footer class="flex-col gap-2">
			<Button class="w-full tabular-nums" onclick={resend} disabled={countdown.seconds > 0}>
				{#if countdown.seconds > 0}
					<Spinner />
					{#if large.current}
						Sende eine neue E-Mail (Warte noch {countdown.seconds} Sekunde{#if countdown.seconds !== 1}n{/if})
					{:else}
						Warte noch {countdown.seconds} Sekunde{#if countdown.seconds !== 1}n{/if}
					{/if}
				{:else}
					<SendHorizontal />
					Sende eine neue E-Mail
				{/if}
			</Button>

			<Button class="w-full" variant="outline" onclick={() => (isChangeOpen = true)}>
				<PencilLine />
				Ändere E-Mail-Addresse
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
