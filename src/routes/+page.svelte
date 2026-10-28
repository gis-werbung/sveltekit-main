<script lang="ts">
	import logo from "$lib/assets/logo_gross.svg";
	import { logout } from "$routes/app/logout.remote";
	import { Button } from "$lib/components/ui/button";
	import { LogIn, LogOut, Rocket, TowerControl } from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import Avatar from "$lib/components/Avatar.svelte";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import { MediaQuery } from "svelte/reactivity";

	const large = new MediaQuery("min-width: 48rem");

	const preise = [
		{ name: "Basic", price: "0€", sachen: ["✔ Bilder", "✘ Kein Profit"], highlight: false },
		{
			name: "Professional",
			price: "1€",
			sachen: ["✔ Profit", "✔ Bilder und Videos", "✘ Videos maximal 15 Sekunden"],
			highlight: true
		},
		{ name: "Buisness", price: "9999e¹⁰⁰⁰⁰⁰⁰€", sachen: ["✔ Videos 30 Sekunden"], highlight: false }
	];

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>GiS Werbung</title>
	<meta name="description" content="pi" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header class="border-b border-border">
		<nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<div class="flex items-center gap-2 text-lg font-medium">
				<img src={logo} alt="logo" class="size-8" />
				GiS Werbung
			</div>

			<div class="flex items-center gap-2">
				{#if data.id && data.title}
					<span class="font-light not-lg:hidden">angemeldet als</span>
					<Avatar id={data.id} name={data.title} size={32} class="not-lg:hidden" />
					<span class="not-lg:hidden">{data.title}</span>

					<Button href="/app">
						<TowerControl />
						Zum Dashboard
					</Button>

					<Button
						variant="outline"
						size={large.current ? "default" : "icon"}
						onclick={() => {
							const promise = logout();
							toast.promise(promise, {
								loading: "Du wirst abgemeldet",
								error: "Beim Abmelden ist etwas schief gelaufen"
							});
							promise.then(() => {
								goto("/");
							});
						}}
					>
						<LogOut />
						<span class="not-md:hidden">Abmelden</span>
					</Button>
				{:else}
					<Button href="/login" variant="outline">
						<LogIn />
						Anmelden
					</Button>

					<Button href="/register">
						<Rocket />
						Loglegen
					</Button>
				{/if}
			</div>
		</nav>
	</header>

	<section class="mx-auto flex max-w-5xl flex-col items-center px-4 py-16">
		<img alt="logo" src={logo} width="300" class="translate-x-9" />
		<h1 class="text-4xl">Willkommen bei GiS Werbung</h1>
		<p class="mt-3 max-w-xl text-muted-foreground">Werbung für dich, an deiner Lieblingsschule</p>
	</section>

	<section class="mx-auto max-w-5xl px-4 pb-16">
		<div class="grid items-start gap-4 md:grid-cols-3">
			<!-- TODO: Rework to fit with our upgrade system-->
			{#each preise as preis}
				<div
					class="flex h-full flex-col rounded-lg border bg-card p-6 {preis.highlight
						? 'border-primary'
						: 'border-border'}"
				>
					<h2 class="text-lg">{preis.name}</h2>
					<p class="justify-self-end text-3xl">{preis.price}</p>
					<ul class="mt-4 space-y-2 pb-6 text-muted-foreground">
						{#each preis.sachen as sache}
							<li>{sache}</li>
						{/each}
					</ul>
					<Button variant="outline" class="mt-auto">Buchen</Button>
				</div>
			{/each}
		</div>
	</section>
</div>
