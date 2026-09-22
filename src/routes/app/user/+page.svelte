<script lang="ts">
	import type { PageProps } from "./$types";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button";
	import * as InputGroup from "$lib/components/ui/input-group/index.js";
	import { KeyRound, LogOut, UserRoundKey, UserRoundPen } from "@lucide/svelte";
	import ButtonGroup from "$lib/components/ui/button-group/button-group.svelte";
	let { data }: PageProps = $props();
</script>

<div class="grid gap-1 lg:grid-cols-2"></div>
<Card.Root>
	<Card.Header>
		<Card.Title>Passwort ändern</Card.Title>
		<Card.Description>Card Description</Card.Description>
	</Card.Header>
	<form>
		<Card.Content class="mb-3 flex flex-col gap-3">
			<InputGroup.Root>
				<InputGroup.Addon>
					<UserRoundKey />
					Aktuelles Passwort
				</InputGroup.Addon>

				<InputGroup.Input />
			</InputGroup.Root>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Neues Passwort
				</InputGroup.Addon>

				<InputGroup.Input />
			</InputGroup.Root>

			<InputGroup.Root>
				<InputGroup.Addon>
					<KeyRound />
					Passwort wiederholen
				</InputGroup.Addon>

				<InputGroup.Input />
			</InputGroup.Root>
		</Card.Content>

		<Card.Footer class="flex gap-3 not-md:flex-col">
			<Button type="submit" class="not-md:w-full">
				<UserRoundPen />
				Passwort ändern
			</Button>

			<Button type="button" variant="outline" class="not-md:w-full">
				<LogOut />
				Alle Geräte abmelden
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
