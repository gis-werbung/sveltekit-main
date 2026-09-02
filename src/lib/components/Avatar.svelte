<script lang="ts">
	import { Style, Avatar } from "@dicebear/core";
	import definition from "@dicebear/styles/planets.json" with { type: "json" };

	let { user, size = 40 }: { user: DBTypes.OpenUser; size?: number } = $props();

	const style = new Style(definition);
	const avatar = $derived(
		user &&
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
				seed: user.id.toString(),
				size
			}).toDataUri()
	);
</script>

<img src={avatar} alt="{user.name}'s avatar" class="shrink-0 rounded-md" />
