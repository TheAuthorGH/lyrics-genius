// TODO: Fill in these values for local testing purposes only.

APIKEYS = {
	musixmatch: '',
	youtube: ''
};

const AJAXMANAGER = {
	lyricsOvh: function(artist, song, done, fail) {
		$.ajax({url: `https://api.lyrics.ovh/v1/${artist}/${song}`})
		.done(done)
		.fail(fail);
	},
	musixmatch: function(method, data, done, fail) {
		$.ajax({
			type: 'GET',
			url: 'https://api.musixmatch.com/ws/1.1/' + method,
			data: Object.assign({
				apikey: APIKEYS['musixmatch'],
				format: 'jsonp',
				callback: 'jsonpCallback'
			}, data),
			dataType: 'jsonp',
			jsonpCallback: 'jsonpCallback',
			contentType: 'application/json'
		})
		.done(done)
		.fail(fail);
	},
	youtubeVideoLookup: function(query, results, done, fail) {
		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/search',
			data: {
				part: 'snippet',
				key: APIKEYS['youtube'],
				maxResults: results,
				q: query
			}
		})
		.done(done)
		.fail(fail);
	},
	youtubeVideoDetails: function(videoId, done, fail) {
		$.ajax({
			url: 'https://www.googleapis.com/youtube/v3/videos',
			data: {
				part: 'contentDetails',
				key: APIKEYS['youtube'],
				id: videoId
			}
		})
		.done(done)
		.fail(fail);
	}
}