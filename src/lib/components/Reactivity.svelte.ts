import * as Dialog from "$lib/components/ui/dialog/index.js";
import * as Drawer from "$lib/components/ui/drawer/index.js";
import { MediaQuery } from "svelte/reactivity";

const large = new MediaQuery("min-width: 40rem");
export const GenericDialog = $derived(large.current ? Dialog : Drawer);
export const isLarge = large.current;
