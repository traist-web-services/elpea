interface PlayArgs {
  uri: string;
  player: any;
  device?: string;
}

interface PauseActionArgs {
  player: any;
  device?: string;
  type: "pause" | "resume";
}

interface PauseResumeArgs {
  player: any;
  device?: string;
}

interface Response {
  error: boolean;
  e?: {
    message: string;
  };
  data?: any;
}

interface UseSpotify {
  play: ({ uri, device, player }: PlayArgs) => Promise<Response>;
  pauseAction: ({ device, player, type }: PauseActionArgs) => Promise<Response>;
  pause: ({ device, player }: PauseResumeArgs) => Promise<Response>;
  resume: ({ device, player }: PauseResumeArgs) => Promise<Response>;
}

const useSpotify: UseSpotify = {
  play: ({ uri, device = null, player }: PlayArgs): Promise<Response> => {
    let albumDetails = {
      artist: "",
      name: "",
      tracks: [],
      image: "",
      duration: 0,
    };

    return new Promise((resolve, reject) => {
      if (!player) {
        reject({
          error: true,
          e: {
            message: "Player not ready",
          },
        });
      }
      player?._options?.getOAuthToken(async (token: string) => {
        const audio = new Audio("/vinylstart.ogg");
        audio.play();

        try {
          const albumFetch = await fetch(
            `https://api.spotify.com/v1/albums?ids=${uri}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const albumJson = await albumFetch.json();

          const album = albumJson.albums[0];

          // TODO: Fix artist type
          albumDetails = {
            artist: album.artists.map((artist: any) => artist.name).join(", "),
            name: album.name,
            tracks: album.tracks.items,
            image: album.images[0].url,
            duration: album.tracks.items.reduce(
              (acc: number, curr: { duration_ms: number }) =>
                acc + curr.duration_ms,
              0
            ),
          };

          // This is a bit odd here... it seems that unless the device is actually playing, then this call will fail. I don't know if this is fixable, but if users choose to enable shuffle manually and defeat the point of this, well then I don't know what we're doing...

          /*
          fetch(
            `https://api.spotify.com/v1/me/player/shuffle?device_id=${player._options.id}&state=false`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );*/

          await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${
              device ?? player._options.id
            }`,
            {
              method: "PUT",
              body: JSON.stringify({ context_uri: `spotify:album:${uri}` }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          resolve({
            error: false,
            data: albumDetails,
          });
        } catch (e) {
          console.error("ERR", e);
          reject({
            error: true,
            e,
          });
        }
      });
    });
  },
  pause: ({ device = null, player }): Promise<Response> => {
    return useSpotify.pauseAction({ device, player, type: "pause" });
  },
  resume: ({ device = null, player }): Promise<Response> => {
    return useSpotify.pauseAction({ device, player, type: "resume" });
  },
  pauseAction: ({ device = null, player, type }): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (!player) {
        reject({
          error: true,
          e: {
            message: "Player not ready",
          },
        });
      }
      player?._options?.getOAuthToken((token: string) => {
        const url =
          type === "pause"
            ? "https://api.spotify.com/v1/me/player/pause"
            : "https://api.spotify.com/v1/me/player/play";
        fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            device_id: device ?? player._options.id,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }).then((response) => {
          if (!response.ok) {
            reject({
              error: true,
              e: {
                message: "Could not play or pause!",
              },
            });
          } else {
            resolve({
              error: false,
              data: null,
            });
          }
        });
      });
    });
  },
};

export default useSpotify;
