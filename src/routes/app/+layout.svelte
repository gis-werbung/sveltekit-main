<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb/index.js";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import { Separator } from "$lib/components/ui/separator";
	import { clearPath, pagePath } from "$routes/app/path";
	import AppSidebar from "./Sidebar.svelte";
	import logo from "$lib/assets/logo_gross.svg";
	import type { LayoutProps } from "./$types";
	import { onNavigate } from "$app/navigation";
	import { TowerControl } from "@lucide/svelte";
	import { page } from "$app/state";

	const { data, children }: LayoutProps = $props();

	onNavigate(() => {
		clearPath();
	});
</script>

<Sidebar.Provider>
	<AppSidebar user={data.user} isAdmin={data.isAdmin} isModerator={data.isModerator} />
	<div class="w-full">
		<header
			class="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b bg-sidebar transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger class="-ms-1" />
				<Separator orientation="vertical" class="me-2 data-[orientation=vertical]:h-4" />

				<img src={logo} alt="GiS Werbung Logo" class="h-8 self-start" />

				<Breadcrumb.Root>
					<Breadcrumb.List>
						{#if page.route.id === "/app"}
							<Breadcrumb.Item>
								<Breadcrumb.Page class="flex items-center gap-2">
									<TowerControl size="16" />
									Dashboard
								</Breadcrumb.Page>
							</Breadcrumb.Item>
						{:else}
							<Breadcrumb.Item>
								<Breadcrumb.Link href="/app" class="flex items-center gap-2" title="Zum Dashboard">
									<TowerControl size="16" />
									<span class="not-md:hidden">Dashboard</span>
								</Breadcrumb.Link>
							</Breadcrumb.Item>
							<Breadcrumb.Separator />

							{#each $pagePath as pathEntry, index}
								{let isLast = $derived(index === $pagePath.length - 1)}
								<Breadcrumb.Item>
									{#if isLast}
										<Breadcrumb.Page>{pathEntry.title}</Breadcrumb.Page>
									{:else}
										<Breadcrumb.Link href={pathEntry.href}>{pathEntry.title}</Breadcrumb.Link>
									{/if}
								</Breadcrumb.Item>

								{#if !isLast}
									<Breadcrumb.Separator />
								{/if}
							{/each}
						{/if}
					</Breadcrumb.List>
				</Breadcrumb.Root>
			</div>
		</header>

		<main class="flex flex-1 flex-col gap-4 p-4 lg:px-64">
			{@render children()}
		</main>
	</div>
</Sidebar.Provider>
