<script lang="ts">
	import type { Snippet } from "svelte";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { cn } from "$lib/utils";
	import type { HTMLAttributes } from "svelte/elements";
	import { page } from "$app/state";

	let {
		children,
		class: className,
		href,
		active,
		...restProps
	}: HTMLAttributes<HTMLAnchorElement> & {
		href?: string;
		active?: boolean;
		children?: Snippet;
	} = $props();

	let isActive = $derived(active ?? (href && page.route.id?.startsWith(href)));
</script>

<Sidebar.MenuButton>
	{#snippet child({ props })}
		<a
			{href}
			{...restProps}
			{...props}
			class={cn(props.class as string, className, "h-fit", isActive && "bg-muted")}
		>
			{@render children?.()}
		</a>
	{/snippet}
</Sidebar.MenuButton>
