<script lang="ts">
	import { SidebarProvider, SidebarTrigger } from '$lib/components/ui/sidebar';
    import type { LayoutProps } from './$types';
    import Sidebar from './Sidebar.svelte';

    const { data, children }: LayoutProps = $props();
</script>

<SidebarProvider>
  <Sidebar />
  <main>
    <SidebarTrigger />
    {@render children?.()}
  </main>
</SidebarProvider>
