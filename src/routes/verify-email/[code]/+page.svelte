<script lang="ts">
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();
</script>

<p>While this site is temporary. I still work!</p>
<p>IsCorrect: {data.isCorrect}</p>
