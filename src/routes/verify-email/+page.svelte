<script lang="ts">
	import { resendEmailCode } from "./verify-email.remote";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import { MailQuestionMark, SendHorizontal } from "@lucide/svelte";
	import { Countdown } from "$lib/components/Countdown.svelte";
	import { toast } from "svelte-sonner";
	import { onDestroy } from "svelte";
	import { Spinner } from "$lib/components/ui/spinner";

	async function resend() {
		const result = resendEmailCode();

		toast.promise(result, {
			loading: "Deine E-Mail wird gesendet",
			success: "Deine E-Mail wurde gesendet",
			error: "Deine E-Mail konnte leider nicht gesendet werden. Probiere es später nochmal"
		});

		countdown.setSeconds(30);
	}

	const countdown = new Countdown(15);

	onDestroy(() => {
		countdown.stopCountdown();
	});
</script>

<svelte:head>
	<title>E-Mail verifizieren | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-xl -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<MailQuestionMark size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Bestätige deine E-Mail</Card.Title>
					<Card.Description>
						Um Missbrauch vorzubeugen, bitten wir dich deine E-Mail Adresse zu bestätigen.
					</Card.Description>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="mb-3 flex flex-col gap-3">
			<span>Eine E-Mail sollte bereits zu deinem E-Mail-Postfach gesendet worden sein.</span>
			<span>Solltest du sie nicht finden tue bitte folgendes</span>
			<ul class="list-disc pl-6">
				<li>Schaue in deinem Spam-Ordner nach</li>
				<li>Gucke, ob deine E-Mail im Konto richtig angegeben ist</li>
				<li>
					Gucke auch, ob irgendwelche Einstellungen oder Filter, die E-Mail verschluckt haben
					könnten
				</li>
				<li>Sende dir eine weitere zu</li>
			</ul>
		</Card.Content>

		<Card.Footer>
			<Button class="w-full" onclick={resend} disabled={countdown.seconds > 0}>
				{#if countdown.seconds > 0}
					<Spinner />
					Warte noch {countdown.seconds} Sekunde{#if countdown.seconds !== 1}n{/if}
				{:else}
					<SendHorizontal />
					Sende eine neue E-Mail
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
