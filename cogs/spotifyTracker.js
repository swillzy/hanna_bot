const SpotifyWebApi = require('spotify-web-api-node');

let spotify = new SpotifyWebApi({
    clientId: 'c9d1c4ceefc94d2f88ec65e1e1fdace8',
    clientSecret: 'f7670ac65f03463f9ea934d7d51a7dd3'
});

async function getTracksFromPlaylist(id) {
    const playlist = (await spotify.getPlaylist(id)).body

    // if there is more tracks than the limit (100 by default)
    if (playlist.tracks.total > playlist.tracks.limit) {

        // Divide the total number of track by the limit to get the number of API calls
        for (let i = 1; i < Math.ceil(playlist.tracks.total / playlist.tracks.limit); i++) {

            const trackToAdd = (await spotify.getPlaylistTracks(id, {
                offset: playlist.tracks.limit * i // Offset each call by the limit * the call's index
            })).body;

            // Push the retreived tracks into the array
            trackToAdd.items.forEach((item) => playlist.tracks.items.push(item));
        }
    }

    return playlist
}

async function getTracksFromAlbum(id) {
    const album = (await spotify.getAlbumTracks(id, { limit: 50 })).body
    return album;
}

async function getTracks(url) {
    const token = await spotify.clientCredentialsGrant();
    spotify.setAccessToken(token.body.access_token);

    var id = '';
    var tracksNames = '';
    if (url.startsWith('https://open.spotify.com/album/')) {
        id = url.split('https://open.spotify.com/album/').pop().split('?').shift();

        const album = await getTracksFromAlbum(id);
        tracksNames = album.items.map(item => item.name + ' ' + item.artists[0].name);
    } else if (url.startsWith('https://open.spotify.com/playlist/')) {
        id = url.split('https://open.spotify.com/playlist/').pop().split('?').shift();

        const playlist = await getTracksFromPlaylist(id);
        tracksNames = playlist.tracks.items.map(item => item.track.name + ' ' + item.track.artists[0].name);
    } else {
        tracksNames = [];
    }
    return tracksNames;
};

exports.getTracks = getTracks;