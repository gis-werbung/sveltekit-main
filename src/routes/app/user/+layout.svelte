<script lang="ts">
	import { addToPath } from "$routes/app/path";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();

	addToPath({ title: "Dein Konto", href: "/app/user" });
</script>

{@render children?.()}
