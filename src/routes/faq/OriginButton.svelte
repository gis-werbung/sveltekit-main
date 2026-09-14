<script lang="ts" module>
	interface OriginData {
		name: string;
		href: string;
	}

	const originMap: Record<string, OriginData> = {
		app: { href: "/app", name: "m Dashboard" }
	};
</script>

<script lang="ts">
	import { page } from "$app/state";
	import { ArrowLeft } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";

	// svelte-ignore non_reactive_update The origin won't change
	let originData: OriginData;

	const origin = page.url.searchParams.get("origin");

	if (origin && origin in originMap) originData = originMap[origin];
</script>

{#if origin}
	<Button title="Zurück zu{originData.name}" href={originData.href}>
		<ArrowLeft />
		<span class="not-lg:sr-only">Zurück zu{originData.name}</span>
	</Button>
{/if}
