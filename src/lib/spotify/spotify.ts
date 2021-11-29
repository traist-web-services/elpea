const playAlbum = async (album, player, session) => {
  const audio = new Audio('/vinylstart.ogg');
  audio.play();
  const res = await fetch('https://api.spotify.com/v1/me/player/play?device_id=' + player.id, {
    method: 'PUT',
    headers: { Authorization: 'Bearer ' + session.user.access_token },
    body: JSON.stringify({
      context_uri: 'spotify:album:' + album.id
    })
  });
  const albumFetch = await fetch(`https://api.spotify.com/v1/albums?ids=${album.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.user.access_token}`
    }
  });
  const albumJson = await albumFetch.json();

  return albumJson.albums[0];
};

export { playAlbum };