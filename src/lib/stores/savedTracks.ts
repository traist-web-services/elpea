import { writable } from "svelte/store";
import type { Track } from '$lib/types';

// const tracksInLs = JSON.parse(localStorage?.getItem("savedTracks")) || [];

export const savedTracks = writable<Track[]>([]);

/*
if (localStorage) {
  savedTracks.subscribe(val => localStorage.setItem("savedTracks", JSON.stringify(val)))
}*/