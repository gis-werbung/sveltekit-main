<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import * as Tooltip from "$lib/components/ui/tooltip";
	import * as Card from "$lib/components/ui/card";
	import * as Alert from "$lib/components/ui/alert";
	import { Info, SendHorizontal, Trash, Upload } from "@lucide/svelte";
	import type { PageProps } from "./$types";
	import { slide } from "svelte/transition";
	import { Button } from "$lib/components/ui/button";
	import { formatBytes } from "bytes-formatter";
	import { secondStringify } from "$lib/utils";

	let { data }: PageProps = $props();

	function calculatePrice(isProfit: boolean, isVideo: boolean, isLong: boolean): number {
		let price = 0;

		// TODO: Combine with DB
		if (isProfit) price += 2;
		if (isLong) price += 2;
		if (isVideo) price += 2;

		return price;
	}

	let isDragging = $state(false);
	let files = $state<FileList>();
	// let value = $state();

	let isProfit = $state(false);
	let isVideo = $state(false);
	let isLong = $state(false);
	let maxLength = $derived(isLong ? 30 : 15);

	let price = $derived(calculatePrice(isProfit, isVideo, isLong));
	let mimeType = $derived(isVideo ? "video/" : "image/");
</script>

<form>
	<div class="mygrid gap-4">
		<span>1.</span>
		<div class="flex flex-col gap-1">
			<label for="title">
				Name:

				<Tooltip.Root>
					<Tooltip.Trigger class="text-sidebar-primary">
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
		<div class="flex flex-col gap-3">
			Angaben zum Beworbenen:
			<label class="flex items-center gap-3">
				<Checkbox bind:checked={isProfit} />
				Mein Beworbenes erzielt Profit
			</label>
		</div>

		<span>3.</span>
		<div class="flex flex-col gap-3">
			<span>Aufpreise:</span>
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
		<div class="flex flex-col gap-3">
			Dein Werbematerial:
			<label
				class="flex w-full cursor-pointer flex-col items-center gap-2 rounded border-2 border-dashed border-muted-foreground p-8 text-center transition-colors"
				class:bg-muted={isDragging}
				// class:hidden={value}
				ondragenter={() => (isDragging = true)}
				ondragleave={() => (isDragging = false)}
				ondrop={(e) => {
					e.preventDefault();
					if (!e.dataTransfer) return;
					const dt = new DataTransfer();
					dt.items.add(e.dataTransfer.files[0]);
					files = dt.files;
				}}
				ondragover={(e) => {
					if (!e.dataTransfer) return;
					const fileItems = [...e.dataTransfer.items].filter((item) => item.kind === "file");
					if (fileItems.length > 0) {
						e.preventDefault();
						if (fileItems.some((item) => item.type.startsWith(mimeType))) {
							e.dataTransfer.dropEffect = "copy";
						} else {
							e.dataTransfer.dropEffect = "none";
						}
					}
				}}
			>
				<Upload class="size-16" strokeWidth="1" />
				<div class="flex flex-col">
					{#key isDragging}
						<p transition:slide>
							{#if isDragging}
								Jetzt loslassen
							{:else}
								Datei hierher ziehen oder klicken
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
					accept="{mimeType}*"
					autocomplete="off"
					bind:files
					// bind:value
					required
				/>
			</label>

			{#if files}
				{const file = files[0]}
				{const blob = new Blob([await file.arrayBuffer()], { type: file.type })}
				{const url = URL.createObjectURL(blob)}
				{let duration = $state(0)}

				<Card.Root class="pt-0">
					{#if isVideo}
						<!-- svelte-ignore a11y_media_has_caption -->
						<video
							src={url}
							class="relative z-20 aspect-video w-full object-cover"
							controls={true}
							bind:duration
						></video>

						<Card.Header>
							<Card.Title>{file.name}</Card.Title>
							<Card.Description>
								{secondStringify(duration)} /
								{formatBytes(file.size)}
							</Card.Description>
						</Card.Header>
					{:else}
						<!-- svelte-ignore a11y_missing_attribute -->
						<img src={url} class="relative z-20 aspect-video w-full object-cover" />
						<Card.Header>
							<Card.Title>{file.name}</Card.Title>
							<Card.Description>
								{formatBytes(file.size)}
							</Card.Description>
						</Card.Header>
					{/if}

					<Card.Footer>
						<Button variant="destructive" class="not-md:w-full">
							<Trash />
							Entfernen
						</Button>
					</Card.Footer>
				</Card.Root>

				{#if isVideo && duration > 0}
					{let remainingTime = $derived(Math.round(maxLength - duration))}
					{#if remainingTime >= 2}
						<Alert.Root>
							<Info />
							<Alert.Title>Dein Video könnte {remainingTime} Sekunden länger sein</Alert.Title>
							<Alert.Description
								>Dein Video darf {maxLength} Sekunden lang sein. Aktuell ist es {Math.round(
									duration
								)} Sekunden lang.
							</Alert.Description>
						</Alert.Root>
					{/if}
				{/if}
			{/if}

			<p class="mt-8">Kosten:</p>
			<p class="tabular-nums">
				<span class="text-bold text-4xl tabular-nums">{price.toFixed(2).replace(".", ",")} €</span>
				/ Monat
			</p>

			<div class="mt-8 flex items-center gap-3">
				<Checkbox name="terms" required />
				<label for="terms">Ich habe die Richtlinien zu Werbung gelesen und stimme ihnen zu</label>
			</div>

			<Button class="md:w-fit" type="submit">
				<SendHorizontal />
				Zur Überprüfung einreichen
			</Button>
		</div>
	</div>
</form>

<svelte:window ondrop={(e) => e.preventDefault()} ondragover={(e) => e.preventDefault()} />

<style>
	.mygrid {
		display: grid;
		grid-template-columns: min-content auto;
	}
</style>
