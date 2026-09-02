<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher, mode, setMode, resetMode } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import { Sun, Moon, MonitorCog } from "@lucide/svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils";

	let { children } = $props();
</script>

<!-- The thing for the notifications -->
<Toaster position="top-center" />

<!-- The little daemon that keeps dark and light mode alive -->
<ModeWatcher />

<!-- Favicon -->
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Bottom left theme menu -->
<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			"absolute right-2 bottom-2",
			buttonVariants({
				variant: mode.current === "light" ? "default" : "secondary",
				size: "icon-lg"
			})
		)}
	>
		<Sun class="scale-100 rotate-0 transition-all! dark:scale-0 dark:-rotate-90" />
		<Moon class="absolute scale-0 rotate-90 transition-all! dark:scale-100 dark:rotate-0" />
		<span class="sr-only">Toggle theme</span>
	</DropdownMenu.Trigger>

	<DropdownMenu.Content align="end">
		<DropdownMenu.Item onclick={() => setMode("light")}>
			<Sun />
			Hell
		</DropdownMenu.Item>

		<DropdownMenu.Item onclick={() => setMode("dark")}>
			<Moon />
			Dunkel
		</DropdownMenu.Item>

		<DropdownMenu.Item onclick={() => resetMode()}>
			<MonitorCog />
			System
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

{@render children()}
