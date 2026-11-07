<script lang="ts">
	import { page } from "$app/state";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import { ArrowLeft, CircleQuestionMark, House, RefreshCw } from "@lucide/svelte";
</script>

<svelte:head>
	<title>{page.status} | GiS Werbung</title>
</svelte:head>

<div class="absolute top-1/2 left-1/2 w-md -translate-1/2 not-sm:w-full">
	<Card.Root class="mx-3">
		<Card.Header>
			<div class="flex items-center gap-3">
				<CircleQuestionMark size="64" strokeWidth="1.25" class="text-muted-foreground" />
				<div>
					<Card.Title>Fehler {page.status}</Card.Title>
					<Card.Description>{page.error?.message}</Card.Description>
				</div>
			</div>
		</Card.Header>
		<Card.Footer class="flex flex-col gap-2">
			<div class="grid w-full grid-cols-2 gap-2">
				<Button class="w-full" onclick={() => navigation.back()}>
					<ArrowLeft />
					Zurück
				</Button>

				<Button onclick={() => navigation.reload()}>
					<RefreshCw />
					Neuladen
				</Button>

				<Button href="/" variant="outline">
					<House />
					Zur Startseite
				</Button>

				<Button href="/app" variant="outline">
					<House />
					Zum Dashboard
				</Button>
			</div>
		</Card.Footer>
	</Card.Root>
</div>
