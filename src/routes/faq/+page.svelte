<script lang="ts">
	import { search } from "./search.remote";
	import { Eye, Pencil, Search, SearchX } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import * as Card from "$lib/components/ui/card";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import * as Pagination from "$lib/components/ui/pagination";
	import logo from "$lib/assets/logo_gross.svg";
	import OriginButton from "./OriginButton.svelte";
	import { Spinner } from "$lib/components/ui/spinner";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let page = $state(1);
	let perPage = 10;
	let startIdx = $derived((page - 1) * perPage);

	let searchTerm = $state("");
	let lastSearchTerm = $state("");
</script>

<svelte:head>
	<title>FAQ Bereich | GiS Werbung</title>
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
					<Breadcrumb.Page>FAQ Bereich</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>

	<div class="flex items-center gap-2 md:w-1/3">
		<Input
			placeholder="Wonach suchst du?"
			bind:value={searchTerm}
			onkeydown={(event) => {
				if (event.key === "Enter") lastSearchTerm = searchTerm;
			}}
		/>

		<Button
			size="icon"
			disabled={searchTerm.length === 0}
			onclick={() => {
				lastSearchTerm = searchTerm;
			}}
		>
			<Search />
			<span class="sr-only">Suchen</span>
		</Button>
	</div>
</header>

<main class="flex flex-col items-center gap-4 p-4 lg:mx-auto lg:w-1/3 lg:pt-16">
	{#await search(lastSearchTerm)}
		<Spinner class="size-8" />
		<span>Suche...</span>
	{:then results}
		{#if lastSearchTerm.length !== 0}
			<Button
				onclick={() => {
					lastSearchTerm = "";
					searchTerm = "";
				}}
			>
				<SearchX />
				Suche beenden
			</Button>
		{/if}

		{#each results.slice(startIdx, startIdx + perPage) as result}
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title>{result.title}</Card.Title>
					<Card.Description>{result.subtitle}</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Geschrieben von: {result.author}</p>
					<p>Zuletzt aktualisiert am: {result.lastChanged}</p>
				</Card.Content>
				<Card.Footer class="justify-end gap-2">
					{#if data.canEdit}
						<Button variant="outline" href="/app/moderator/faq-editor/{result.id}">
							<Pencil />
							Bearbeiten
						</Button>
					{/if}

					<Button href="/faq/{result.id}">
						<Eye />
						Lesen
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}

		<Pagination.Root bind:page count={results.length} {perPage} class="mt-4">
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.Previous />
					</Pagination.Item>

					{#each pages as page (page.key)}
						{#if page.type === "ellipsis"}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}

					<Pagination.Item>
						<Pagination.Next />
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	{/await}
</main>
