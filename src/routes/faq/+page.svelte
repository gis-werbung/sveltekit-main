<script lang="ts">
	import { page as pageState } from "$app/state";
	import { createArticle, search } from "./faq.remote";
	import {
		Eye,
		EyeOff,
		Heading1,
		House,
		Pencil,
		Search,
		SearchAlert,
		SearchX,
		TextAlignStart,
		X
	} from "@lucide/svelte";
	import { Button, buttonVariants } from "$lib/components/ui/button";
	import * as InputGroup from "$lib/components/ui/input-group";
	import * as Card from "$lib/components/ui/card";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import * as Pagination from "$lib/components/ui/pagination";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Drawer from "$lib/components/ui/drawer";
	import { Spinner } from "$lib/components/ui/spinner";
	import OriginButton from "./OriginButton.svelte";
	import logo from "$lib/assets/logo_gross.svg";
	import { MediaQuery } from "svelte/reactivity";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();

	let page = $state(1);
	let perPage = 10;
	let startIdx = $derived((page - 1) * perPage);

	let searchTerm = $state("");
	let lastSearchTerm = $state("");

	let isCreateOpen = $state(false);
	const large = new MediaQuery("min-width: 40rem");
	const GenericDialog = $derived(large.current ? Dialog : Drawer);
</script>

<svelte:head>
	<title>FAQ Bereich | GiS Werbung</title>
</svelte:head>

<GenericDialog.Root bind:open={isCreateOpen}>
	<GenericDialog.Content class="sm:max-w-sm">
		<form {...createArticle} class="mx-auto w-full max-w-md not-sm:px-4 not-sm:*:px-0! sm:contents">
			<GenericDialog.Header>
				<GenericDialog.Title>Neuen Artikel erstellen</GenericDialog.Title>
				<GenericDialog.Description>
					Erstelle einen neuen FAQ-Artikel. Standmäßig wird er noch unsichtbar bleiben
				</GenericDialog.Description>
			</GenericDialog.Header>

			<div class="flex flex-col gap-3">
				<InputGroup.Root>
					<InputGroup.Addon>
						<Heading1 />
						Überschrift
					</InputGroup.Addon>

					<InputGroup.Input
						{...createArticle.fields.title.as("text")}
						placeholder="Wie man ein Bäumchen gießt"
					/>
				</InputGroup.Root>
				<span class="text-destructive">{createArticle.fields.title.issues()?.[0].message}</span>

				<InputGroup.Root>
					<InputGroup.Addon>
						<TextAlignStart />
						Beschreibung
					</InputGroup.Addon>

					<InputGroup.Input
						{...createArticle.fields.description.as("text")}
						placeholder="(optional)"
					/>
				</InputGroup.Root>
				<span class="text-destructive"
					>{createArticle.fields.description.issues()?.[0].message}</span
				>
			</div>

			<GenericDialog.Footer>
				<GenericDialog.Close type="button" class={buttonVariants({ variant: "outline" })}>
					<X />
					Abbrechen
				</GenericDialog.Close>

				<Button type="submit">
					<Pencil />
					Erstellen
				</Button>
			</GenericDialog.Footer>
		</form>
	</GenericDialog.Content>
</GenericDialog.Root>

<header
	class="sticky top-0 left-0 flex w-full justify-between gap-4 border-b bg-card p-4 not-md:flex-col md:px-16"
>
	<div class="flex items-center gap-3">
		<OriginButton />

		<img src={logo} alt="GiS Werbung Logo" class="h-8 self-start" />

		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/" class="flex items-center gap-2" title="Zur Startseite">
						<House size="16" />
						<span class="not-md:hidden">GiS Werbung</span>
					</Breadcrumb.Link>
				</Breadcrumb.Item>

				<Breadcrumb.Separator />

				<Breadcrumb.Item>
					<Breadcrumb.Page>FAQ Bereich</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</div>

	<div class="flex items-center gap-2 md:w-1/3">
		<InputGroup.Root>
			<InputGroup.Input
				placeholder="Wonach suchst du?"
				bind:value={searchTerm}
				onkeydown={(event) => {
					if (event.key === "Enter") lastSearchTerm = searchTerm;
				}}
			/>
			<InputGroup.Addon>
				<Search />
			</InputGroup.Addon>
		</InputGroup.Root>

		<Button
			class="not-md:size-8"
			disabled={searchTerm.length === 0}
			onclick={() => {
				lastSearchTerm = searchTerm;
			}}
		>
			<Search />
			<span class="not-md:sr-only">Suchen</span>
		</Button>

			<Button
				variant="outline"
				onclick={() => {
					isCreateOpen = true;
				}}
			>
				<Pencil />
				Neuer Artikel
			</Button>
	</div>
</header>

<main class="flex flex-col items-center gap-4 p-4 lg:mx-auto lg:w-2/5 lg:min-w-lg lg:pt-16">
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

		{#if results.length === 0}
			<SearchAlert size="96" strokeWidth="1" />
			<p class="text-lg">Für deine Suchanfrage wurden keine Artikel gefunden</p>
		{/if}
		{#each results.slice(startIdx, startIdx + perPage) as result}
			<Card.Root class="w-full">
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-lg">
						{#if !result.public && data.canEdit}
							<EyeOff title="versteckt" />
						{:else if data.canEdit}
							<Eye title="öffentlich" />
						{/if}
						{result.title}
					</Card.Title>
					{#if result.subtitle}
						<Card.Description>{result.subtitle}</Card.Description>
					{/if}
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

					<Button href="/faq/{result.id}{pageState.url.search}">
						<Eye />
						Lesen
					</Button>
				</Card.Footer>
			</Card.Root>
		{/each}

		{#if results.length > 0}
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
		{/if}
	{/await}
</main>
