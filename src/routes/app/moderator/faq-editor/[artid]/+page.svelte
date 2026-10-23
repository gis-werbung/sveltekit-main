<!-- svelte-ignore state_referenced_locally -->
<script lang="ts">
	import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
	import * as Alert from "$lib/components/ui/alert";
	import {
		Heading1Icon,
		NewspaperIcon,
		SaveIcon,
		SquareArrowOutUpRight,
		TextAlignStartIcon,
		TriangleAlert
	} from "@lucide/svelte";
	import { edit } from "./editor.remote";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
	import { Button } from "$lib/components/ui/button";
	import type { PageProps } from "./$types";
	import { Switch } from "$lib/components/ui/switch";

	let { data }: PageProps = $props();

	edit.fields.title.set(data.title);
	if (data.description) edit.fields.description.set(data.description);
	edit.fields.content.set(data.content);
	edit.fields.isPublic.set(data.isPublic);
</script>

<svelte:head>
	<title>Bearbeiten: {edit.fields.title.value()} | FAQ Bereich | GiS Werbung</title>
</svelte:head>

<form
	class="contents"
	{...edit.enhance(async (form) => {
		const promise = form.submit();
		toast.promise(promise, {
			loading: "Die Änderungen werden gespeichert...",
			error: "Die Änderungen konnten nicht gespeichert werden. Probiere es später nochmal",
			success: "Die Änderungen wurden gespeichert"
		});
	})}
>
	<label class="flex items-center gap-2 text-lg text-muted-foreground" for="title">
		<Heading1Icon />
		Überschrift
	</label>

	<Input
		class="py-6 pl-2! text-3xl font-extrabold tracking-tight lg:text-4xl"
		{...edit.fields.title.as("text")}
		placeholder="Wie man Schweine zum Fliegen bringt"
		autocomplete="off"
	/>

	<label class="flex items-center gap-2">
		<Switch name="isPublic" checked={data.isPublic} />
		Artikel öffentlich stellen
	</label>
	<span class="text-destructive">{edit.fields.title.issues()?.[0].message}</span>

	<label class="mt-2 flex items-center gap-2 text-lg text-muted-foreground" for="description">
		<TextAlignStartIcon />
		Beschreibung
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
	</label>

	<MarkdownEditor {...edit.fields.content.as("text")} defaultContent={data.content}>
		{#snippet buttons()}
			<Button size="sm" type="submit">
				<SaveIcon />
				Speichern
			</Button>

			<Button
				size="sm"
				class="text-foreground"
				variant="outline"
				href="/faq/{data.id}?origin=editor&art_id={data.id}"
			>
				<SquareArrowOutUpRight />
				Öffnen
			</Button>
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
