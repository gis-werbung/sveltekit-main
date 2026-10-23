<script lang="ts">
	import * as InputGroup from "$lib/components/ui/input-group";
	import Renderer from "$lib/components/Markdown.svelte";
	import type { HTMLTextareaAttributes } from "svelte/elements";
	import type { WithoutChildren, WithElementRef } from "bits-ui";
	import type { Snippet } from "svelte";
	import {
		BoldIcon,
		EyeIcon,
		Heading1Icon,
		Heading2Icon,
		Heading3Icon,
		Heading4Icon,
		ImageIcon,
		ItalicIcon,
		LinkIcon,
		UnderlineIcon
	} from "@lucide/svelte";
	import { Separator } from "./ui/separator";
	import { cn } from "$lib/utils";

	function genericWrap(start: string, end?: string) {
		if (!textaera) return;
		if (end === undefined) end = start;

		source =
			source.substring(0, textaera.selectionStart) +
			start +
			(source.substring(textaera.selectionStart, textaera.selectionEnd) || "Text") +
			end +
			source.substring(textaera.selectionEnd);
	}

	function insert(text: string) {
		source =
			source.substring(0, textaera.selectionStart) + text + source.substring(textaera.selectionEnd);
	}

	let {
		buttons,
		prefixElement,
		defaultContent = "",
		...restProps
	}: { defaultContent?: string; buttons?: Snippet; prefixElement?: Snippet } & WithoutChildren<
		WithElementRef<HTMLTextareaAttributes>
	> = $props();

	// svelte-ignore state_referenced_locally
	let source = $state(defaultContent);
	let textaera = $state<HTMLTextAreaElement>(null!);
</script>

{#snippet lastButtons()}
	<InputGroup.Button
		size="icon-sm"
		onclick={() => genericWrap("[", "](https://example.com)")}
		title="Verknüpfung"
	>
		<LinkIcon />
	</InputGroup.Button>

	<InputGroup.Button
		size="icon-sm"
		onclick={() => insert("![Bildbeschreibung](https://picsum.photos/200/300)")}
		title="Bild"
	>
		<ImageIcon />
	</InputGroup.Button>
{/snippet}

<InputGroup.Root>
	<div class="flex w-full not-lg:flex-col lg:*:w-1/2">
		<InputGroup.Textarea
			bind:value={source}
			bind:ref={textaera}
			{...restProps}
			class="resize-none"
			autocomplete="off"
		/>
		<div class="bg-muted not-lg:border-t lg:border-l">
			<p class="flex items-center gap-1 p-4 pb-0 text-muted-foreground">
				<EyeIcon />
				Vorschau
			</p>
			<div class="p-4">
				<Renderer {source} />
			</div>
		</div>
	</div>

	<InputGroup.Addon
		align="block-start"
		class={cn("cursor-auto border-b", buttons && "not-lg:border-b-0")}
	>
		{#if prefixElement}
			<div class="flex items-center gap-1 text-lg">
				{@render prefixElement()}
				<Separator orientation="vertical" class="ms-2 data-[orientation=vertical]:h-6" />
			</div>
		{/if}

		<InputGroup.Button size="icon-sm" onclick={() => genericWrap("**")} title="Fett">
			<BoldIcon />
		</InputGroup.Button>

		<InputGroup.Button size="icon-sm" onclick={() => genericWrap("_")} title="Kursiv">
			<ItalicIcon />
		</InputGroup.Button>

		<InputGroup.Button
			size="icon-sm"
			onclick={() => genericWrap("<u>", "</u>")}
			title="Unterstrichen"
		>
			<UnderlineIcon />
		</InputGroup.Button>

		<Separator orientation="vertical" class="data-[orientation=vertical]:h-6" />

		<InputGroup.Button
			size="icon-sm"
			onclick={() => genericWrap("# ", "\n\nArtikel")}
			title="Überschrift 1"
		>
			<Heading1Icon />
		</InputGroup.Button>

		<InputGroup.Button
			size="icon-sm"
			onclick={() => genericWrap("## ", "\n\nArtikel")}
			title="Überschrift 2"
		>
			<Heading2Icon />
		</InputGroup.Button>

		<InputGroup.Button
			size="icon-sm"
			onclick={() => genericWrap("### ", "\n\nArtikel")}
			title="Überschrift 3"
		>
			<Heading3Icon />
		</InputGroup.Button>

		<InputGroup.Button
			size="icon-sm"
			onclick={() => genericWrap("#### ", "\n\nArtikel")}
			title="Überschrift 4"
		>
			<Heading4Icon />
		</InputGroup.Button>

		<Separator orientation="vertical" class="not-lg:hidden data-[orientation=vertical]:h-6" />

		<div class="contents not-lg:hidden">
			{@render lastButtons()}

			<div class="contents *:first:ms-auto">
				{@render buttons?.()}
			</div>
		</div>
	</InputGroup.Addon>

	<InputGroup.Addon align="block-start" class="cursor-auto border-b lg:hidden">
		{@render lastButtons()}

		<div class="contents *:first:ms-auto">
			{@render buttons?.()}
		</div>
	</InputGroup.Addon>
</InputGroup.Root>
