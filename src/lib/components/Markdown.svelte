<script lang="ts" module>
	const headingClasses: Record<string, ClassValue> = {
		h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
		h2: "scroll-m-20 mt-5 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0",
		h3: "scroll-m-20 mt-3 text-2xl font-semibold tracking-tight",
		h4: "scroll-m-20 mt-1 text-xl font-semibold tracking-tight"
	};
</script>

<script lang="ts">
	import Markdown from "@humanspeak/svelte-markdown";
	import type { ClassValue } from "svelte/elements";

	let { source }: { source: string } = $props();
</script>

<Markdown {source}>
	{#snippet heading({ depth, children })}
		<svelte:element this={"h" + depth} class={headingClasses["h" + depth]}>
			{@render children?.()}
		</svelte:element>
	{/snippet}

	{#snippet paragraph({ children })}
		<p class="leading-7 not-first:mt-6">
			{@render children?.()}
		</p>
	{/snippet}

	{#snippet link({ children, href })}
		<a {href} class="text-sidebar-primary hover:underline">{@render children?.()}</a>
	{/snippet}
</Markdown>
