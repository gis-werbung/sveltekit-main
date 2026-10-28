<script>
	import logo from "$lib/assets/logo_gross.svg";

	const title = "gis-werbung.de";

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
</script>

<svelte:head>
	<title>GiS Werbung</title>
	<meta name="description" content="pi" />
</svelte:head>

<div class="min-h-screen bg-background text-foreground">
	<header class="border-b border-border">
		<nav class="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
			<a href="/">{title}</a>
			<div class="flex items-center gap-2">
				<a href="/login" class="inline-flex items-center justify-center rounded-md border border-border px-4 py-1.5 text-sm font-medium transition-colors hover:bg-muted">Login</a>
				<a href="/register" class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Loslegen</a>
			</div>
		</nav>
	</header>

	<section class="mx-auto max-w-5xl px-4 py-16 text-center">
		<img alt="logo" src={logo} width="300" class="mx-auto translate-x-9" />
		<h1 class="text-4xl">Werbung am GiS</h1>
		<p class="mx-auto mt-3 max-w-xl text-muted-foreground">Niklas mach bitte das layout.css blau</p>
	</section>

	<section class="mx-auto max-w-5xl px-4 pb-16">
		<div class="grid items-start gap-4 md:grid-cols-3">
			{#each preise as preis}
				<div
					class="rounded-lg border bg-card p-6 {preis.highlight
						? 'border-primary'
						: 'border-border'}">
					<h2 class="text-lg">{preis.name}</h2>
					<p class="mt-2 text-3xl">{preis.price}</p>
					<ul class="mt-4 space-y-2 pb-6 text-muted-foreground">
						{#each preis.sachen as sache}
							<li>{sache}</li>
						{/each}
					</ul>
					<button class="mt-auto w-full rounded-md border border-border px-4 py-2 hover:bg-muted">
						Buchen
					</button>
				</div>
			{/each}
		</div>
	</section>
</div>
