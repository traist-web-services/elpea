export type Album = {
  tracks: {
    items: Track[] & { duration_ms?: number; }
  }
  images: Image[];
};

export type Artist = {
  name: string;
}

export type Image = {
  url: string;
}

export type Player = {
  id: string;
};

export type Track = {
  track: Track;
  track_number: number;
  name: string;
  album: Album;
  duration_ms: number;
  artists: Artist[];
};

export type State = {
  position: number;
  duration: number;
};
