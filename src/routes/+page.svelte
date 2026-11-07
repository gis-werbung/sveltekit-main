<script lang="ts">
	import logo from "$lib/assets/logo_gross.svg";
	import { logout } from "$routes/app/logout.remote";
	import { Button } from "$lib/components/ui/button";
	import {
		CircleQuestionMark,
		LifeBuoy,
		LogIn,
		LogOut,
		Rocket,
		TowerControl
	} from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import Avatar from "$lib/components/Avatar.svelte";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import { MediaQuery } from "svelte/reactivity";
	import { Separator } from "$lib/components/ui/separator";

	const large = new MediaQuery("min-width: 48rem");

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>GiS Werbung</title>
	<meta name="description" content="pi" />
</svelte:head>

<header class="sticky top-0 left-0 z-10 border-b border-border bg-card">
	<nav class="mx-auto flex items-center justify-between px-4 py-3 lg:max-w-6xl">
		<div class="flex items-center gap-2 font-medium sm:text-lg">
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
					variant="secondary"
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
				<Button href="/login" variant="secondary">
					<LogIn />
					Anmelden
				</Button>

				<Button href="/register">
					<Rocket />
					Loslegen
				</Button>
			{/if}
		</div>
	</nav>
</header>

<main class="mb-8 flex flex-col gap-16 *:px-4 md:items-center">
	<section class="flex flex-col items-center pt-16 text-center">
		<img alt="logo" src={logo} width="300" class="translate-x-9" />
		<h1 class="text-4xl">Willkommen bei GiS Werbung</h1>
		<p class="mt-3 max-w-xl text-muted-foreground">Werbung für dich, an deiner Lieblingsschule</p>
	</section>

	<section class="mt-16">
		<div class="flex flex-col items-center gap-4">
			<div class="flex w-full flex-col gap-4 rounded-lg border border-primary bg-card p-6 sm:w-96">
				<div class="flex flex-col items-center gap-2">
					<span class="text-xl">Werbung schon ab</span>
					<p class="flex items-start">
						<span class="text-6xl font-medium">0€</span>*
					</p>
				</div>

				<ul>
					<li>✔ Bilder unterstützt</li>
					<li>✔ 15 sek. Anzeigedauer</li>
					<li class="text-muted-foreground">✘ Videos</li>
				</ul>
			</div>

			<p class="mt-2 text-xl font-medium">Aufpreise:</p>

			<div class="flex justify-center gap-4 *:w-full not-sm:w-full not-lg:flex-col sm:*:w-96">
				<div class="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
					<div class="flex flex-col items-center gap-2">
						<span class="text-xl">Videos</span>
						<span class="text-6xl font-medium">2€</span>
					</div>

					<ul>
						<li>✔ Videos unterstützt</li>
						<li>✔ Max 15 sek. Länge</li>
						<li class="text-muted-foreground">✘ Ton</li>
					</ul>
				</div>

				<div class="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
					<div class="flex flex-col items-center gap-2">
						<span class="text-xl">Längere Werbung</span>
						<span class="text-6xl font-medium">2€</span>
					</div>

					<ul>
						<li>✔ Bilder: 30 sek. Angezeigedauer</li>
						<li>✔ Videos: Max 30 sek. Länge</li>
						<li class="text-muted-foreground">✘ Bevorzugung im Algorithmus</li>
					</ul>
				</div>
			</div>

			<Button size="lg" href={data.isLoggedIn ? "/app/create" : "/register"} class="my-4">
				<Rocket />
				Buchen
			</Button>

			<p class="text-xs text-muted-foreground">
				*: Der 0€-Preis ist nur für nicht-profitable Zwecke verfügbar. Für profitable Zwecke liegt
				der Grundpreis bei 2€ / Monat
			</p>
		</div>
	</section>

	<Separator orientation="horizontal" />

	<section class="flex items-center gap-4 not-md:flex-col">
		<CircleQuestionMark class="size-32 text-muted-foreground" strokeWidth="1" />

		<div class="flex flex-col gap-4 px-4">
			<p class="text-4xl font-medium">Brauchst du Hilfe?</p>
			<p>In unserem FAQ-Bereich sowie im Support-Bereich kannst du nach Hilfe suchen.</p>

			<div class="flex gap-2 not-md:flex-col">
				<Button disabled={!data.isLoggedIn} href={"/app/support"}>
					<LifeBuoy />
					Zum Support-Bereich
				</Button>

				<Button href="/faq" variant="secondary">
					<CircleQuestionMark />
					Zum FAQ-Bereich
				</Button>
			</div>

			{#if !data.isLoggedIn}
				<p class="text-sm text-muted-foreground">
					Der Support-Bereich ist nur für angemeldete Nutzer verfügbar. Solltest du dich nicht mehr
					anmelden können, kannst du uns jederzeit per
					<a
						class="link"
						href="mailto:support@gis-werbung.de?subject=Support-Anfrage%3A%20Probleme%20mit%20der%20Anmeldung&body=Hier%20kannst%20du%20dein%20Problem%20beschreiben.%20Gebe%20bitte%20alle%20wichtigen%20Informationen%20weiter%20(E-Mail-Adresse%2C%20Fehlermeldung%20etc.)%20jedoch%20keine%20geheimen%20Daten%20(Passw%C3%B6rter%20etc.)"
					>
						E-Mail
					</a>
					erreichen
				</p>
			{/if}
		</div>
	</section>
</main>
