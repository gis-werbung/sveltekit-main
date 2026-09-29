<script lang="ts">
	import { Checkbox } from "$lib/components/ui/checkbox";
	import { Input } from "$lib/components/ui/input";
	import * as Tooltip from "$lib/components/ui/tooltip/index.js";
	import { Info } from "@lucide/svelte";
	import type { PageProps } from "./$types";

	let { data }: PageProps = $props();
</script>

<form>
	<div class="mygrid gap-4">
		<span>1.</span>
		<div class="flex flex-col gap-1">
			<label for="title">Name:</label>
			<Input name="title" type="text" placeholder="Werbung für Bäume" />
		</div>

		<span>2.</span>
		<div class="flex items-center gap-3">
			<Checkbox id="terms" />
			<label for="terms">Mein Beworbenes erzielt Profit</label>
		</div>

		<span>3.</span>
		<div class="flex flex-col gap-3">
			<span>Aufpreise:</span>
			<div class="mygrid gap-3">
				<Checkbox id="terms" />
				<label for="terms">
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
				<Checkbox id="terms" />
				<label for="terms">
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
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<label for="File">File</label>
			<Input id="File" type="file" />
		</div>
	</div>
</form>

<style>
	.mygrid {
		display: grid;
		grid-template-columns: min-content max-content;
	}
</style>
