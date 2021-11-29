import { writable } from "svelte/store";
import type { Album, State, Track } from '$lib/types'

export const state = writable<State>(null);
export const track = writable<Track>(null);
export const album = writable<Album>(null);
export const playing = writable(false)