
// Not the safest way to store api keys!
APIKEYS = {
	musixmatch: '5c128ccc9a0073a5b9f5d79fda27e664'
}

const VIEWMANAGER = {
	_id: 0,
	view: function(id) {
		$(`.view-element[viewid*='${id}']`).show().prop('hidden', false);
		$(`.view-element:not([viewid*='${id}'])`).hide().prop('hidden', true);
	}
}

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
	}
}

function Track(data) {
	this.name = data.track.track_name;
	this.artist = data.track.artist_name;
	this.id = data.track.track_id;
}

/* Start View */
function initStartView() {
	VIEWMANAGER.view(0);
}

/* Loading View */

function initLoadingView() {
	VIEWMANAGER.view(1);
}

/* Results View */

function initResultsView(results) {
	VIEWMANAGER.view(2);
	$('#lyrics-results-list').empty();
	if(results.length === 0) {
		initErrorView('Sorry, no results found! Please try something different!');
		return;
	}
	for(let track of results)
		$('#lyrics-results-list').append(`
			<li>
				<div>
					<span class="track-name">${track.name}</span>
					<span class="track-artist">${track.artist}</span>
				</div>
				<div>
					<button class="track-select">Select</button>
					<button class="track-analyze">Analyze</button>
				</div>
			</li>`);
}

function handleResultsViewControls() {
	
}

/* Analysis */

function initAnalysisView(lyrics) {

}

// Comparison

// Errors

function initErrorView(message) {
	VIEWMANAGER.view(5);
	$('#lyrics-error > p').text(message);
}

// General

function handleControls() {
	handleResultsViewControls();

	$('.lyrics-lookup').submit(function(evt) {
		/* Download the lyrics as well ? */
		evt.preventDefault();
		initLoadingView();
		AJAXMANAGER.musixmatch('track.search', {q: $(this).find('input[name="query"]').val() },
			results => {
				if(results.message.header.status_code != 200) {
					initErrorView("Sorry, we can't gather lyrics data right now.");
					return;
				}
				initResultsView(results.message.body.track_list.map(t => new Track(t)));
			},
			() => initErrorView("Sorry, we can't gather lyrics data right now."));
	});
}

function initNPH() {
	initStartView();
	handleControls();
}

$(initNPH);