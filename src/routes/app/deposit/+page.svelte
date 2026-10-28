<script lang="ts">
	import type { PageProps } from "./$types";
	import * as RadioGroup from "$lib/components/ui/radio-group/index.js";
	import { addToPath } from "$routes/app/path";
	import { getLocalTimeZone, today, type CalendarDate } from "@internationalized/date";
	import { Calendar } from "$lib/components/ui/calendar/index.js";
	let { data }: PageProps = $props();
	let value = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
	addToPath({ title: "Geld einzahlen" });
</script>

<form>
	<div class="mygrid gap-6">
		<span>1.</span>
		<Calendar
			type="single"
			bind:value
			class="w-max rounded-lg border [--cell-size:--spacing(11)]"
			captionLayout="dropdown"
		/>

		<span>2.</span>
		<RadioGroup.Root value="comfortable" class="w-fit">
			<label class="flex items-center gap-3">
				<RadioGroup.Item value="first" />
				1. Pause
			</label>
			<label class="flex items-center gap-3">
				<RadioGroup.Item value="second" />
				2. Pause
			</label>
			<label class="flex items-center gap-3">
				<RadioGroup.Item value="Mittag" />
				Mittagspause
			</label>
		</RadioGroup.Root>
	</div>
</form>

<style>
	.mygrid {
		display: grid;
		grid-template-columns: min-content auto;
	}
</style>
