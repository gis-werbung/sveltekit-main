<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import logo from "$lib/assets/logo_gross.svg";
	import OriginButton from "../OriginButton.svelte";
	import type { PageProps } from "./$types";
	import { page } from "$app/state";
	import Markdown from "$lib/components/Markdown.svelte";

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{data.title} | FAQ Bereich | GiS Werbung</title>
</svelte:head>

<header
	class="sticky top-0 left-0 flex w-full justify-between gap-2 border-b bg-card p-4 not-md:flex-col md:px-16"
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
					<Breadcrumb.Link href="/faq{page.url.search}">FAQ Bereich</Breadcrumb.Link>
				</Breadcrumb.Item>

				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>
</header>

<main class="p-4 lg:px-64 lg:pt-16">
	<Markdown source={data.content} />
</main>
