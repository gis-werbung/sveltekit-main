<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import * as Card from "$lib/components/ui/card";
	import * as Alert from "$lib/components/ui/alert";
	import {
		Blocks,
		ClipboardList,
		FileExclamationPoint,
		Image,
		Info,
		SendHorizontal,
		SquareArrowOutUpRight,
		Trash,
		Upload,
		Videotape,
		WholeWord
	} from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import { slide } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { formatBytes } from "bytes-formatter";
	import { Separator } from "$lib/components/ui/separator";
	import { cn } from "$lib/utils";

	let { data }: PageProps = $props();

	function calculatePrice(isProfit: boolean, isVideo: boolean, isLong: boolean): number {
		let price = 0;

		// TODO: Combine with DB
		if (isProfit) price += 2;
		if (isLong) price += 2;
		if (isVideo) price += 2;

		return price;
	}

	function deleteFiles() {
		const elem: HTMLInputElement | null = document.querySelector("input#magicFileBox[type=file]");
		if (elem) {
			elem.value = "";
			hasFile = false;
		}
	}

	let isDragging = $state(false);
	let files = $state<FileList>();
	let hasFile = $state(false);
	let uploadedWrongFile = $state(false);

	let isProfit = $state(false);
	let isVideo = $state(false);
	let isLong = $state(false);
	let maxLength = $derived(isLong ? 30 : 15);

	let price = $derived(calculatePrice(isProfit, isVideo, isLong));
	let mimeType = $derived(isVideo ? "video/" : "image/");
</script>

<div>
	<p class="text-xl">Schön, dass du bei uns Werbung bestellen möchtest!</p>
	<p class="font-light">
		Bitte gib folgende Informationen an, damit wir deine Werbung überprüfen können.
	</p>
</div>

<Alert.Root>
	<Info />
	<Alert.Title>Optionen zum Planen der Werbung sind erst nach der Einreichung möglich</Alert.Title>
	<Alert.Description>
		Dort kannst du dann festlegen, ab wann deine Werbung auf unseren Geräten geschaltet werden soll
		und ab wann nicht mehr. Du bezahlst nur für die Monate, in denen die Werbung auch geschaltet
		wird.
		<br />
		Beachte hierbei, dass jeden Monatsanfang abgerechnet wird.
	</Alert.Description>
</Alert.Root>

<Separator class="my-4" />

<form>
	<div class="mygrid gap-6">
		<span>1.</span>
		<div class="flex flex-col gap-1 pb-2">
			<label for="title" class="flex items-center gap-2">
				<WholeWord class="size-5" />
				Name:

				<Tooltip.Root>
					<Tooltip.Trigger class="ml-1 text-sidebar-primary">
						<Info class="size-4" />
					</Tooltip.Trigger>

					<Tooltip.Content>
						<p>
							Dieser Name hilft dir, deine Werbung leichter wiederzufinden. Wir können deinen Namen
							nicht sehen.
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</label>
			<Input name="title" required type="text" placeholder="Werbung für Bäume" />
		</div>

		<span>2.</span>
		<div class="flex flex-col gap-3 pb-2">
			<span class="flex items-center gap-2">
				<ClipboardList class="size-5" />
				Angaben zum Beworbenen:
			</span>
			<label class="flex items-center gap-3">
				<Checkbox bind:checked={isProfit} />
				Mein Beworbenes erzielt Profit
				<Tooltip.Root>
					<Tooltip.Trigger class="text-sidebar-primary">
						<Info class="size-4" />
					</Tooltip.Trigger>

					<Tooltip.Content>
						<p>
							Darunter fällt alles, was direkte Bezahlungen oder Spenden annimmt. Das wären z.B.
							Schülerfirmen oder ein spendenfinanziertes Theaterstück. AGs oder Wahlwerbung fällt
							nicht darunter.
						</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</label>
		</div>

		<span>3.</span>
		<div class="flex flex-col gap-3 pb-2">
			<span class="flex items-center gap-2">
				<Blocks class="size-5" />
				Aufpreise:
			</span>
			<div class="flex flex-col gap-3">
				<label class="flex items-center gap-3">
					<Checkbox bind:checked={isLong} />
					Längere Werbung
					<Tooltip.Root>
						<Tooltip.Trigger class="text-sidebar-primary">
							<Info class="size-4" />
						</Tooltip.Trigger>

						<Tooltip.Content>
							<p>
								Deine Werbung wird für 30 Sekunden statt 15 Sekunden angezeigt. Solltest du ein
								Video verwenden, darf dieses ebenfalls, statt 15 Sekunden, 30 Sekunden lang sein.
							</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</label>

				<label class="flex items-center gap-3">
					<Checkbox bind:checked={isVideo} />
					Video statt Bild
					<Tooltip.Root>
						<Tooltip.Trigger class="text-sidebar-primary">
							<Info class="size-4" />
						</Tooltip.Trigger>

						<Tooltip.Content>
							<p>Zeige ein Video statt einem Bild an.</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</label>
			</div>
		</div>

		<span>4.</span>
		<div class="flex flex-col gap-3 pb-2">
			Dein Werbematerial:
			<label
				class={cn(
					"flex w-full cursor-pointer flex-col items-center gap-2 rounded border-2 p-8 text-center transition-colors",
					uploadedWrongFile
						? "border-destructive/75 bg-muted"
						: "border-dashed border-muted-foreground",
					isDragging && "bg-muted",
					hasFile && files?.[0] && "hidden"
				)}
				ondragenter={() => (isDragging = true)}
				ondragleave={() => {
					isDragging = false;
					uploadedWrongFile = false;
				}}
				ondrop={(e) => {
					e.preventDefault();
					if (!e.dataTransfer) return;
					const dt = new DataTransfer();
					dt.items.add(e.dataTransfer.files[0]);
					files = dt.files;
					hasFile = true;
				}}
				ondragover={(e) => {
					if (!e.dataTransfer) return;
					const fileItems = [...e.dataTransfer.items].filter((item) => item.kind === "file");
					if (fileItems.length > 0) {
						e.preventDefault();
						if (fileItems.some((item) => item.type.startsWith(mimeType))) {
							uploadedWrongFile = false;
							e.dataTransfer.dropEffect = "copy";
						} else {
							uploadedWrongFile = true;
							e.dataTransfer.dropEffect = "none";
						}
					}
				}}
			>
				<div class="flex flex-col">
					{#key isDragging || uploadedWrongFile}
						<div class="flex w-full justify-center gap-2" transition:slide>
							{#if uploadedWrongFile}
								<FileExclamationPoint class="size-16" strokeWidth="1" />
							{:else}
								<Upload class="size-16" strokeWidth="1" />
								{#if isVideo}
									<Videotape class="size-16" strokeWidth="1" />
								{:else}
									<Image class="size-16" strokeWidth="1" />
								{/if}
							{/if}
						</div>
					{/key}
				</div>

				<div class="flex flex-col">
					{#key isDragging || uploadedWrongFile}
						<p transition:slide>
							{#if uploadedWrongFile}
								Dieser Dateityp wird nicht von deiner aktuellen Konfiguration erlaubt
							{:else if isDragging}
								Jetzt loslassen
							{:else}
								<span class="not-md:hidden"> Datei hierher ziehen oder klicken </span>
								<span class="md:hidden"> Hier klicken, um Datei hochzuladen </span>
							{/if}
						</p>
					{/key}
				</div>
				<p class="text-sm">
					Akzeptiert gängige {isVideo ? "Video" : "Bild"}formate<br />Empfohlenes Seitenverhältnis:
					16:9
				</p>
				<input
					type="file"
					class="hidden"
					id="magicFileBox"
					accept="{mimeType}*"
					autocomplete="off"
					bind:files
					onchange={() => {
						hasFile = Boolean(files?.[0]);
						if (hasFile && !files![0].type.startsWith(mimeType)) {
							deleteFiles();
							uploadedWrongFile = true;
							setTimeout(() => {
								uploadedWrongFile = false;
							}, 5000);
						}
					}}
				/>
			</label>

			{#if hasFile && files?.[0]}
				{const file = files[0]}
				{const blob = new Blob([await file.arrayBuffer()], { type: file.type })}
				{const url = URL.createObjectURL(blob)}
				{let duration = $state(0)}

				<Card.Root class="pt-0">
					{#if isVideo}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video src={url} class="relative z-20 w-full object-cover" controls={true} bind:duration
						></video>

						<Card.Header>
							<Card.Title>{file.name}</Card.Title>
							<Card.Description>
								{Math.round(duration)} Sekunden /
								{formatBytes(file.size)}
							</Card.Description>
						</Card.Header>
					{:else}
						<!-- svelte-ignore a11y_missing_attribute -->
						<img src={url} class="relative z-20 w-full object-cover" />
						<Card.Header>
							<Card.Title>{file.name}</Card.Title>
							<Card.Description>
								{formatBytes(file.size)}
							</Card.Description>
						</Card.Header>
					{/if}

					<Card.Footer class="flex gap-2 not-md:flex-col">
						<Button variant="destructive" class="not-md:w-full" onclick={deleteFiles}>
							<Trash />
							Entfernen
						</Button>

						<Button
							variant="outline"
							class="not-md:w-full"
							onclick={() => {
								window.open(url, "popup", "width=1280;height=720");
							}}
						>
							<SquareArrowOutUpRight />
							Öffnen
						</Button>
					</Card.Footer>
				</Card.Root>

				{#if isVideo && duration > 0}
					{let remainingTime = $derived(Math.round(maxLength - duration))}
					{#if remainingTime >= 2}
						<Alert.Root>
							<Info />
							<Alert.Title>Dein Video könnte {remainingTime} Sekunden länger sein</Alert.Title>
							<Alert.Description>
								Dein Video darf {maxLength} Sekunden lang sein. Aktuell ist es {Math.round(
									duration
								)} Sekunden lang.
							</Alert.Description>
						</Alert.Root>
					{:else if remainingTime < 0}
						{let upgradeCanSolve = $derived(!isLong && remainingTime >= -15)}
						<Alert.Root variant="destructive">
							<FileExclamationPoint />
							<Alert.Title>Dein Video hat {Math.abs(remainingTime)} Sekunden Überlänge</Alert.Title>
							<Alert.Description>
								Dein Video darf {maxLength} Sekunden lang sein. Aktuell ist es {Math.round(
									duration
								)} Sekunden lang.
								{#if upgradeCanSolve}
									<br />
									Hinweis: Wenn du den Aufpreis "Längere Werbung" buchen würdest, wäre dein Video im Zeitrahmen
								{/if}
							</Alert.Description>
							{#if upgradeCanSolve}
								<Alert.Action>
									<Button
										onclick={() => {
											isLong = true;
										}}
										variant="outline"
									>
										<Blocks />
										Aufpreis buchen
									</Button>
								</Alert.Action>
							{/if}
						</Alert.Root>
					{/if}
				{/if}
			{/if}
		</div>
	</div>

	<Separator class="my-8" />

	<p>Kosten:</p>
	<p class="tabular-nums">
		<span class="text-bold text-4xl tabular-nums">{price.toFixed(2).replace(".", ",")} €</span>
		/ Monat
	</p>

	<label class="mt-8 mb-4 flex items-center gap-3">
		<Checkbox required />
		<span>
			Ich habe die
			<a class="text-sidebar-primary hover:underline" href="/static/guidelines-ads">
				Richtlinien
			</a>
			zu Werbung gelesen und stimme ihnen zu
		</span>
	</label>

	<Button class="md:w-fit" type="submit">
		<SendHorizontal />
		Zur Überprüfung einreichen
	</Button>
</form>

<svelte:window ondrop={(e) => e.preventDefault()} ondragover={(e) => e.preventDefault()} />

<style>
	.mygrid {
		display: grid;
		grid-template-columns: min-content auto;
	}
</style>
