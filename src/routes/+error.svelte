<script lang="ts">
	import { page } from "$app/state";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import { CircleQuestionMark, House } from "@lucide/svelte";
</script>

<svelte:head>
	<title>{page.status} | Gis Werbung</title>
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
		<Card.Footer>
			<Button class="w-full" href="/">
				<House />
				Zur Startseite
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
