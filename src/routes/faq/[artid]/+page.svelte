<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import logo from "$lib/assets/logo_gross.svg";
	import OriginButton from "../OriginButton.svelte";
	import type { PageProps } from "./$types";
	import { page } from "$app/state";
	import Markdown from "$lib/components/Markdown.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import Avatar from "$lib/components/Avatar.svelte";
	import { Clock, Pencil, UserRound } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import { Switch } from "$lib/components/ui/switch";
	import { toggleVisibilty } from "../faq.remote";
	import { toast } from "svelte-sonner";

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

	{#if data.canEdit}
		<div class="flex items-center gap-3">
			<label class="flex items-center gap-2">
				<Switch
					checked={data.isPublic}
					onCheckedChange={(checked) => {
						toast.promise(toggleVisibilty(checked), {
							loading: "Die Sichtbarkeit wird geändert...",
							error: "Die Sichtbarkeit konnte nicht geändert werden. Probiere es später erneut",
							success: "Der Artikel ist nun " + (checked ? "öffentlich" : "versteckt")
						});
					}}
				/>
				Öffentlich
			</label>

			<Button variant="outline" href="/app/moderator/faq-editor/{data.id}">
				<Pencil />
				Bearbeiten
			</Button>
		</div>
	{/if}
</header>

<main class="p-4 lg:px-64 lg:pt-16">
	<div class="flex items-end justify-between">
		<div>
			<h1 aria-label="Titel" class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
				{data.title}
			</h1>
			<h2 aria-label="Beschreibung" class="font-medium">
				{data.description}
			</h2>

			<h3 class="mt-3 flex items-center gap-1.5">
				<UserRound strokeWidth="1.75" />
				geschrieben von
				<Avatar name={data.creator} id={data.creatorId} size={24} />
				<span class="font-semibold">{data.creator}</span>
			</h3>
		</div>

		<p class="flex items-center gap-1.5 font-extralight">
			zuletzt aktualisiert: {data.lastChanged}
			<Clock strokeWidth="1" />
		</p>
	</div>

	<Separator class="mt-6" />
	<Markdown source={data.content} />
</main>
