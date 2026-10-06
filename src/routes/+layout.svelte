<script lang="ts">
	import "./layout.css";
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher, mode, setMode, resetMode } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import { Sun, Moon, MonitorCog, GlobeX, RefreshCw } from "@lucide/svelte";
	import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
	import { buttonVariants } from "$lib/components/ui/button/index.js";
	import { cn } from "$lib/utils";
	import { TooltipProvider } from "$lib/components/ui/tooltip";
	import { Button } from "$lib/components/ui/button";

	let { children } = $props();
</script>

<!-- The thing for the notifications -->
<Toaster position="top-center" />

<!-- The little daemon that keeps dark and light mode alive -->
<ModeWatcher />

<!-- Tooltip render -->

<!-- Favicon -->
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<!-- Bottom left theme menu -->
<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={cn(
			"fixed right-2 bottom-2",
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

<TooltipProvider>
	{@render children()}
</TooltipProvider>

<noscript>
	<div
		class="color-sc fixed top-0 left-0 z-20 h-screen w-screen bg-black opacity-75 backdrop-blur-2xl"
	></div>
	<div class="fixed top-1/2 left-1/2 z-30 -translate-1/2 rounded bg-white p-8">
		<h1 class="flex items-center gap-2 text-xl font-bold tracking-tight lg:text-2xl">
			<GlobeX class="size-7" />
			Diese Seite funktioniert nur mit JavaScript
		</h1>
		<p class="my-2 text-lg">
			Derzeit ist JavaScript-Code auf dieser Seite deaktiviert. Dies könnte folgende Gründe haben:
		</p>
		<ul class="list-disc">
			<li>Dein Browser unterstützt schlichtweg kein JavaScript</li>
			<li>JavaScript ist browserweit deaktiviert</li>
			<li>
				Eine Erweiterung etc. hat JavaScript auf dieser Seite deaktiviert (z.B. NoScript oder uBlock
				Origin)
			</li>
		</ul>

		<Button href="/" class="mt-4">
			<RefreshCw />
			Erneut probieren
		</Button>
	</div>
</noscript>
