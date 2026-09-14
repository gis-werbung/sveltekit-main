<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import logo from "$lib/assets/logo_gross.svg";
	import OriginButton from "../OriginButton.svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	// TODO: Implement with db
	let title = "Mein Artikel";
</script>

<svelte:head>
	<title>{title} | FAQ Bereich | GiS Werbung</title>
</svelte:head>

<header
	class="sticky top-0 left-0 flex w-full justify-between gap-2 bg-card p-4 not-md:flex-col md:px-16"
>
	<div class="flex items-center gap-3">
		<OriginButton />

		<img src={logo} alt="GiS Werbung Logo" class="h-8 self-start" />

		<Breadcrumb.Root>
			<Breadcrumb.List class="text-xl">
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">GiS Werbung</Breadcrumb.Link>
				</Breadcrumb.Item>

				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Link href="/faq">FAQ Bereich</Breadcrumb.Link>
				</Breadcrumb.Item>

				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Page>{title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<main class="p-4 lg:px-64 lg:pt-16">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
		{title}
	</h1>
	<p class="leading-7 not-first:mt-6">
		Ich tue jetzt so als wäre ich ein inhaltvoller Artikel. Nur leider berge ich ein Geheimnis. Ich
		weiß von nichts, obgleich mein Name nicht Hase ist.
	</p>
</main>
