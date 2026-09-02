<script lang="ts">
	import { logout } from "./logout.remote";
	import Avatar from "$lib/components/Avatar.svelte";
	import * as Alert from "$lib/components/ui/alert";
	import * as Sidebar from "$lib/components/ui/sidebar";
	import {
		CircleQuestionMark,
		FilePlus,
		LifeBuoy,
		Files,
		FileExclamationPoint,
		FilePlay,
		File,
		FileSearch,
		LogOut,
		Mails,
		Monitor,
		HardDrive,
		UserCog,
		MessagesSquare,
		Wrench,
		Asterisk,
		BanknoteArrowUp,
		BanknoteX
	} from "@lucide/svelte";
	import { toast } from "svelte-sonner";
	import { goto } from "$app/navigation";
	import Badge from "$lib/components/ui/badge/badge.svelte";
	import { cn } from "$lib/utils";

	let {
		user,
		isAdmin,
		isModerator
	}: { user: DBTypes.OpenUser; isAdmin: boolean; isModerator: boolean } = $props();
</script>

<Sidebar.Root collapsible="icon" class="text-nowrap">
	<Sidebar.Header class="transition-all">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Alert.Root
					variant="destructive"
					class="bg-destructive/5 transition-all group-data-[collapsible=icon]:overflow-hidden"
				>
					<BanknoteX class="transition-all group-data-[collapsible=icon]:-translate-x-0.75" />
					<!-- Example text -->
					<Alert.Title>Fehlendes Guthaben:</Alert.Title>
					<Alert.Description>3 Werbungen können nicht bezahlt werden</Alert.Description>
				</Alert.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Werbungen</Sidebar.GroupLabel>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/list">
						<Files />
						Alle Werbungen
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge>11</Sidebar.MenuBadge>
				</Sidebar.MenuItem>

				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/list?filter=running">
						<FilePlay />
						Laufende Werbungen
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge>5</Sidebar.MenuBadge>
				</Sidebar.MenuItem>

				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/list?filter=paused">
						<File />
						Pausierte Werbungen
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge>3</Sidebar.MenuBadge>
				</Sidebar.MenuItem>

				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/list?filter=rejected">
						<FileExclamationPoint />
						Abgelehnte Werbungen
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge class="text-destructive">1</Sidebar.MenuBadge>
				</Sidebar.MenuItem>

				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/list?filter=rejected">
						<FileSearch />
						Eingereichte Werbungen
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge>2</Sidebar.MenuBadge>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>

		<Sidebar.Group>
			<Sidebar.GroupLabel>Erstellen</Sidebar.GroupLabel>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/create">
						<FilePlus />
						Neue Werbung
					</Sidebar.MenuLink>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>

		{#if isModerator}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-amber-600 dark:text-amber-300">
					Moderator-Panel
				</Sidebar.GroupLabel>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuLink href="/app/moderator/support">
							<Mails />
							Support Anfragen
						</Sidebar.MenuLink>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuLink href="/app/moderator/support">
							<MessagesSquare />
							FAQ Editor
						</Sidebar.MenuLink>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuLink href="/app/moderator/devices">
							<Monitor />
							Geräte Verwaltung
						</Sidebar.MenuLink>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Group>
		{/if}

		{#if isAdmin}
			<Sidebar.Group>
				<Sidebar.GroupLabel class="text-destructive">Admin-Panel</Sidebar.GroupLabel>
				<Sidebar.Menu>
					<Sidebar.MenuItem>
						<Sidebar.MenuLink href="/app/moderator/devices">
							<HardDrive />
							Server Verwaltung
						</Sidebar.MenuLink>
					</Sidebar.MenuItem>

					<Sidebar.MenuItem>
						<Sidebar.MenuLink href="/app/moderator/devices">
							<UserCog />
							Moderator Verwaltung
						</Sidebar.MenuLink>
					</Sidebar.MenuItem>
				</Sidebar.Menu>
			</Sidebar.Group>
		{/if}

		<Sidebar.Group>
			<Sidebar.GroupLabel>Support</Sidebar.GroupLabel>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/support">
						<LifeBuoy />
						Support Chat
					</Sidebar.MenuLink>
					<Sidebar.MenuBadge class="bg-green-800 text-white!">12</Sidebar.MenuBadge>
				</Sidebar.MenuItem>

				<Sidebar.MenuItem>
					<Sidebar.MenuLink href="/app/support">
						<CircleQuestionMark />
						FAQ Bereich
					</Sidebar.MenuLink>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuLink href="/app/user" class="group-data-[collapsible=icon]:p-1!">
					<Avatar {user} />

					<div class="overflow-hidden text-ellipsis">
						<span class="font-medium">{user.name}</span>
						<br />
						<span class="text-xs">{user.email}</span>
						<br />
						{#if isAdmin}
							<Badge variant="destructive">
								<Asterisk /> Admin
							</Badge>
						{:else if isModerator}
							<Badge variant="secondary">
								<Wrench /> Moderator
							</Badge>
						{/if}
					</div>
				</Sidebar.MenuLink>
			</Sidebar.MenuItem>

			<Sidebar.Separator class="my-2 group-data-[collapsible=icon]:hidden" />

			<Sidebar.MenuItem>
				<Sidebar.MenuLink href="/app/deposit">
					<BanknoteArrowUp />
					Guthaben einzahlen
				</Sidebar.MenuLink>
				<Sidebar.MenuBadge class={cn("tabular-nums", user.balance <= 2 && "text-destructive")}>
					{user.balance.toFixed(2).replace(".", ",")} €
				</Sidebar.MenuBadge>
			</Sidebar.MenuItem>

			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					onclick={async () => {
						try {
							await logout();
							goto("/");
							toast.success("Auf Wiedersehen!");
						} catch {
							toast.error("Leider konntest du nicht abgemeldet werden");
						}
					}}
				>
					<LogOut />
					Abmelden
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
