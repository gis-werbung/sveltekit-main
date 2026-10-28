<script lang="ts">
	import { Style, Avatar } from "@dicebear/core";
	import definition from "@dicebear/styles/planets.json" with { type: "json" };
	import { cn } from "$lib/utils";
	import type { ClassValue } from "clsx";

	let {
		name,
		id,
		size = 40,
		class: className
	}: { name: string; id: number; size?: number; class?: ClassValue } = $props();

	const style = new Style(definition);
	const avatar = $derived(
		new Avatar(style, {
			backgroundColorFill: ["linear"],
			backgroundColorAngle: -71,
			backgroundColorFillStops: 2,
			moonColorFillStops: 2,
			planetColorFill: ["linear"],
			planetColorAngle: 45,
			planetColorFillStops: 2,
			ringVariant: {
				bold: 1,
				double: 1,
				thin: 1
			},
			ringProbability: 100,
			seed: id.toString(),
			size
		}).toDataUri()
	);
</script>

<img src={avatar} alt="{name}'s avatar" class={cn("shrink-0 rounded-md", className)} />
