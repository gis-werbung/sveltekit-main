<script lang="ts">
	import type { PageProps } from "./$types";

	const { data }: PageProps = $props();
</script>

<p>One day, this will be the user dashboard!</p>
<p>
	But currently, I only know your name. Let me guess, your name is: {data.user.name} with an email of
	{data.user.email}
</p>
