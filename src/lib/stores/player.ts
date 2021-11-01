import { writable } from 'svelte/store';
import type { Player } from '$lib/types';
export const player = writable<Player>(null);