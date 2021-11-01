import { writable } from "svelte/store";
import type { Track } from '$lib/types';
export const savedTracks = writable<Track[]>([]);