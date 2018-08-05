
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

const TRACKMANAGER = {
	_selected: [],
	_maxSelected: 4,
	_cached: [],
	cache: function(track) {
		if(track && !this._cached.find(t => t.equals(track)))
			this._cached.push(track);
		return this.cached();
	},
	undoCache: function(track) {
		if(track)
			this._cached.splice(this._cached.indexOf(track), 1);
	},
	cached: function(index) {
		if(index)
			return this._cached[index];
		return this._cached.length;
	},
	select: function(track) {
		if(track)
			this._selected.push(track);
		return this.selected();
	},
	undoSelect: function(track) {
		if(track)
			this._selected.splice(this._selected.indexOf(track), 1);	
	},
	selected: function(index) {
		if(index)
			return this._cached[index];
		return this._selected.length;
	},
	canSelect: function() {
		return this._maxSelected > this.selected();
	},
	clear: function() {
		this.clearCache();
		this.clearSelected();
	},
	clearCache: function() {
		this._cached.length = 0;
	},
	clearSelected: function() {
		this._selected.length = 0;
	}
}

function Track(data) {
	this.name = data.track.track_name;
	this.artist = data.track.artist_name;
	this.equals = function(other) {
		return this.name === other.name && this.artist === other.artist;
	}
}

// Start View

function initStartView() {
	VIEWMANAGER.view(0);
}

// Loading View

function initLoadingView() {
	VIEWMANAGER.view(1);
}

// Results View

function initResultsView(results) {
	VIEWMANAGER.view(2);
	$('#lyrics-results-list').empty();
	if(results.length === 0) {
		initErrorView('Sorry, no results found! Please try something different!');
		return;
	}
	for(let track of results) {
		$('#lyrics-results-list').append(`
			<li trackid="${TRACKMANAGER.cache(track) - 1}">
				<div>
					<span class="track-name">${track.name}</span>
					<span class="track-artist">${track.artist}</span>
				</div>
				<div>
					<button class="track-select" aria-label="select track for comparison"><span class="fas fa-plus"></span></button>
				</div>
			</li>`);
	}
}

function handleResultsViewControls() {
	$('#lyrics-results-list')
		.on('click', '.track-select', function(evt) {
			const button = $(this);
			const track = TRACKMANAGER.cached(button.closest('li').attr('trackid'));
			if(!button.hasClass('selected')) {
				if(!TRACKMANAGER.canSelect())
					return;
				TRACKMANAGER.select(track);
			} else {
				TRACKMANAGER.undoSelect(track);
			}
			button.toggleClass('selected');
			button.find('span').toggleClass('fa-plus').toggleClass('fa-check');
		})
		.on('click', '.track-name', function() {
			initAnalysisView(TRACKMANAGER.cached[$(this).closest('li').attr('trackid')]);
		});
}

// Analysis

function initAnalysisView(track) {

}

// Comparison

// Errors

function initErrorView(message) {
	VIEWMANAGER.view(5);
	$('#lyrics-error > p').text(message);
}

// Help

function displayHelp() {
	$('#lyrics-help').show().prop('hidden', false);
}

function hideHelp() {
	$('#lyrics-help').hide().prop('hidden', true);
}

// General

function handleControls() {
	handleResultsViewControls();

	$('.lyrics-lookup').submit(function(evt) {
		evt.preventDefault();
		initLoadingView();
		TRACKMANAGER.clearCache();
		AJAXMANAGER.musixmatch('track.search', {q: $(this).find('input[name="query"]').val() },
			results => {
				if(results.message.header.status_code != 200) {
					initErrorView("Sorry, we can't gather lyrics data right now.");
					return;
				}
				initResultsView(results.message.body.track_list.map(t => new Track(t)));
			},
			() => initErrorView("Error gathering lyrics."));
	});

	$('#lyrics-help-open').click(displayHelp);
	$('#lyrics-help-close').click(hideHelp);
	hideHelp();
}

function initLG() {
	initStartView();
	handleControls();
}

$(initLG);