<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import * as Alert from "$lib/components/ui/alert";
	import {
		Heading1Icon,
		NewspaperIcon,
		Pencil,
		SaveIcon,
		SquareArrowOutUpRight,
		TextAlignStartIcon,
		TriangleAlert,
		UndoIcon
	} from "@lucide/svelte";
	import { Textarea } from "$lib/components/ui/textarea";
	import { InputGroupButton } from "$lib/components/ui/input-group";
	import { Input } from "$lib/components/ui/input";
	import { Switch } from "$lib/components/ui/switch";
	import { edit } from "./editor.remote";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import { addToPath, replaceTitle } from "$routes/app/path";
	import type { PageProps } from "./$types";
	import { MediaQuery } from "svelte/reactivity";
	import { cutTextOffAfter } from "$lib/utils";

	let { data }: PageProps = $props();

	const large = new MediaQuery("min-width: 40rem");

	let lastTitle = $state(data.title);
	let lastDescription = $state(data.description);
	let lastContent = $state(data.content);
	let lastIsPublic = $state(data.isPublic);

	let isPublic = $state(data.isPublic);

	let titleUnchanged = $derived(lastTitle === edit.fields.title.value());
	let descriptionUnchanged = $derived(lastDescription === edit.fields.description.value());
	let contentUnchanged = $derived(lastContent === edit.fields.content.value());
	let isPublicUnchanged = $derived(lastIsPublic === isPublic);

	let dataUnchanged = $derived(
		titleUnchanged && descriptionUnchanged && contentUnchanged && isPublicUnchanged
	);

	function reset() {
		edit.fields.title.set(lastTitle);
		if (lastDescription) edit.fields.description.set(lastDescription);
		edit.fields.content.set(lastContent);
		edit.fields.isPublic.set(lastIsPublic);
	}

	addToPath({ title: "FAQ-Editor", href: "/faq?origin=app" });
	addToPath({ title: data.title });

	reset();

	$effect(() => {
		const title = edit.fields.title.value() || "<unbenannt>";
		replaceTitle(large.current ? title : cutTextOffAfter(title, 24));
	});
</script>

<svelte:head>
	<title>Bearbeiten: {edit.fields.title.value()} | FAQ Bereich | GiS Werbung</title>
</svelte:head>

{#snippet changedMarker(isUnchanged: boolean)}
	<span
		class="flex items-center gap-1 text-sm text-amber-600 italic dark:text-amber-400"
		class:hidden={isUnchanged}
	>
		(<Pencil size="12" />
		geändert)
	</span>
{/snippet}

<form
	class="contents"
	{...edit.enhance(async (form) => {
		const promise = form.submit();
		toast.promise(promise, {
			loading: "Die Änderungen werden gespeichert...",
			error: "Die Änderungen konnten nicht gespeichert werden. Probiere es später nochmal",
			success: "Die Änderungen wurden gespeichert"
		});

		promise.then(() => {
			lastTitle = data.title;
			lastDescription = data.description;
			lastContent = data.content;
			lastIsPublic = data.isPublic;
		});
	})}
>
	<label class="flex items-center gap-2 text-lg text-muted-foreground" for="title">
		<Heading1Icon />
		Überschrift
		{@render changedMarker(titleUnchanged)}
	</label>

	<Input
		class="py-6 pl-2! text-3xl font-extrabold tracking-tight lg:text-4xl"
		{...edit.fields.title.as("text")}
		placeholder="Wie man Schweine zum Fliegen bringt"
		autocomplete="off"
	/>

	<label class="flex items-center gap-2">
		<Switch name="isPublic" bind:checked={isPublic} />
		Artikel öffentlich stellen
		{@render changedMarker(isPublicUnchanged)}
	</label>
	<span class="text-destructive">{edit.fields.title.issues()?.[0].message}</span>

	<label class="mt-2 flex items-center gap-2 text-lg text-muted-foreground" for="description">
		<TextAlignStartIcon />
		Beschreibung
		{@render changedMarker(descriptionUnchanged)}
	</label>

	<Textarea
		class="resize-none py-2 font-semibold"
		{...edit.fields.description.as("text")}
		placeholder="Hier erfährst du alles, was man wissen muss"
		autocomplete="off"
	/>
	<span class="text-destructive">{edit.fields.description.issues()?.[0].message}</span>

	<label class="mt-2 flex items-center gap-2 text-lg text-muted-foreground" for="description">
		<NewspaperIcon />
		Artikelinhalt
		{@render changedMarker(contentUnchanged)}
	</label>

	<MarkdownEditor {...edit.fields.content.as("text")} defaultContent={data.content}>
		{#snippet buttons()}
			<InputGroupButton
				size="sm"
				variant="default"
				type="submit"
				disabled={dataUnchanged}
				title="Speichern"
			>
				<SaveIcon />
				Speichern
			</InputGroupButton>

			<InputGroupButton
				size={large.current ? "sm" : "icon-sm"}
				class="text-foreground"
				variant="outline"
				title="Artikel öffnen"
				onclick={() => {
					if (
						dataUnchanged ||
						confirm(
							"Deine Änderungen werden hierbei nicht gespeichert. Möchtest du den Artikel trotzdem öffnen?"
						)
					) {
						goto(`/faq/${data.id}?origin=editor&art_id=${data.id}`);
					}
				}}
			>
				<SquareArrowOutUpRight />
				<span class="not-lg:hidden">Öffnen</span>
			</InputGroupButton>

			<InputGroupButton
				size={large.current ? "sm" : "icon-sm"}
				class="text-destructive"
				variant="outline"
				title="Änderungen zurücksetzen"
				disabled={dataUnchanged}
				onclick={reset}
			>
				<UndoIcon />
				<span class="not-lg:hidden">Zurücksetzen</span>
			</InputGroupButton>
		{/snippet}
	</MarkdownEditor>
	<span class="text-destructive">{edit.fields.content.issues()?.[0].message}</span>

	{#if edit.fields.content.value()?.startsWith("# ")}
		<Alert.Root variant="destructive">
			<TriangleAlert />
			<Alert.Title>Der angegebe Titel wird bereits als Überschrift angezeigt</Alert.Title>
			<Alert.Description>
				Vermeide es daher, den Artikel selbst nochmal mit einer "Überschift 1" zu beginnen
			</Alert.Description>
		</Alert.Root>
	{/if}

	<span class="text-destructive">{edit.fields.issues()?.[0].message}</span>
</form>

<svelte:window
	ondrop={(e) => e.preventDefault()}
	ondragover={(e) => e.preventDefault()}
	onbeforeunload={(e) => {
		if (dataUnchanged) {
			return undefined;
		}

		// Nicht jeder Browser zeigt diese Meldung mehr an. Manche schon
		const confirmationMessage =
			"Deine Änderungen wurden noch nicht gespeichert. Wenn du die Seite jetzt verlässt, werden deine Änderungen nicht gespeichert.";

		(e || window.event).returnValue = confirmationMessage; // Gecko + IE
		return confirmationMessage; // Gecko + Webkit, Safari, Chrome etc.
	}}
/>
