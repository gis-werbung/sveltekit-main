<script lang="ts">
	import type { PageProps } from "./$types";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import { House, MailCheck, MailX, SendHorizontal, UserRoundKey } from "@lucide/svelte";

	const { data }: PageProps = $props();
</script>

<svelte:head>
	<title>E-Mail verifizieren | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				{#if data.isCorrect}
					<MailCheck size="64" strokeWidth="1.25" class="text-muted-foreground" />
				{:else}
					<MailX size="64" strokeWidth="1.25" class="text-muted-foreground" />
				{/if}
				<div>
					{#if data.isCorrect}
						<Card.Title>E-Mail bestätigt!</Card.Title>
						<Card.Description>Viel Erfolg mit GiS Werbung</Card.Description>
					{:else}
						<Card.Title>Dein Code ist ausgelaufen</Card.Title>
						<Card.Description>
							Codes halten nur 30 Minuten. Bitte fordere einen neuen an
						</Card.Description>
					{/if}
				</div>
			</div>
		</Card.Header>

		{#if !data.isCorrect && !data.isLoggedIn}
			<Card.Content>
				Du bist derzeit nicht angemeldet und kannst deswegen keinen neuen Code anfordern. Benutze
				entweder ein Gerät, bei dem du angemeldet bist oder melde dich an.
			</Card.Content>
		{/if}

		<Card.Footer>
			{#if !data.isLoggedIn}
				<Button class="w-full" variant="outline" href="/login">
					<UserRoundKey />
					Anmelden
				</Button>
			{:else if data.isCorrect}
				<Button class="w-full" href="/app">
					<House />
					Zum Dashboard
				</Button>
			{:else}
				<Button class="w-full" href="/verify-email">
					<SendHorizontal />
					Sende eine neue E-Mail
				</Button>
			{/if}
		</Card.Footer>
	</Card.Root>
</div>
