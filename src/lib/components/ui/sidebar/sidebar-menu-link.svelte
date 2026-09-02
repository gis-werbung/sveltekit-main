<script lang="ts">
	import type { Snippet } from "svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		children,
		class: className,
		...restProps
	}: HTMLAttributes<HTMLAnchorElement> & {
		href?: string;
		children?: Snippet;
	} = $props();
</script>

<Sidebar.MenuButton>
	{#snippet child({ props })}
		<a {...restProps} {...props} class={cn(props.class as string, className, "h-fit")}>
			{@render children?.()}
		</a>
	{/snippet}
</Sidebar.MenuButton>
