<script lang="ts">
	import * as Sidebar from "$lib/components/ui/sidebar/index.js";
	import { Plus } from "@lucide/svelte";
</script>

<Sidebar.Root>
	<Sidebar.Content>
     <Sidebar.Group>
        <Sidebar.GroupLabel>Gis Werbung</Sidebar.GroupLabel>
         <Sidebar.GroupAction>
        <Plus/> <span class="sr-only">Add Project</span>
      </Sidebar.GroupAction>

     </Sidebar.Group>
    </Sidebar.Content>
</Sidebar.Root>
