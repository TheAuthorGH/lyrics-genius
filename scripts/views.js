const VIEWMANAGER = {
	_id: 0,
	view: function(id) {
		$(`.view-element[viewid*='${id}']`).show().prop('hidden', false);
		$(`.view-element:not([viewid*='${id}'])`).hide().prop('hidden', true);
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
	const view = $('#lyrics-results-list');
	view.empty();
	updateSelectionControls();
	if(results.length === 0) {
		initErrorView('<span class=\"fas fa-question\" style=\"font-size: 64px; margin: 32px;\"></span><br/>Sorry, no results found! Please try something different!');
		return;
	}
	for(let track of results) {
		view.append(`
			<li trackid="${TRACKMANAGER.cache(track) - 1}" tabindex="0">
				<div class="track-meta">
					<span class="track-name">${track.name}</span>
					<span class="track-artist">${track.artist}</span>
				</div>
				<div>
					<button class="track-select" aria-label="select track for comparison" title="select track for comparison"><span class="fas fa-plus"></span></button>
				</div>
			</li>`);
	}
}

function updateSelectionControls() {
	$('#lyrics-selection-counter').find('span').last().text(`${TRACKMANAGER.selected()}/${TRACKMANAGER.maxSelected()}`);
}

function handleResultsViewControls() {
	$('#lyrics-results-list')
		.on('click', '.track-select', function(evt) {
			evt.stopPropagation();
			const button = $(this);
			const track = TRACKMANAGER.cached(button.closest('li').attr('trackid'));
			if(!button.hasClass('selected')) {
				if(!TRACKMANAGER.canSelect())
					return;
				TRACKMANAGER.select(track);
			} else {
				TRACKMANAGER.undoSelect(track);
			}
			updateSelectionControls();
			button.toggleClass('selected');
			button.find('span').toggleClass('fa-plus').toggleClass('fa-check');
		})
		.on('keyup', 'li', function(evt) {
			evt.preventDefault();
			if(evt.keyCode === 13)
				$(this).click();
		})
		.on('click', 'li', function() {
			initAnalysisView(TRACKMANAGER.cached($(this).closest('li').attr('trackid')));
		});
}

// Analysis

function initAnalysisView(track) {
	initLoadingView();
	const view = $('#lyrics-analysis');
	AJAXMANAGER.lyricsOvh(track.artist, track.name,
		results => {
			if(results.lyrics) {
				AJAXMANAGER.youtubeVideoLookup(track.artist + ' ' + track.name, 1,
				data => {
					const ytsnippet = view.find('.youtube-snippet');
					const item = data.items[0];
					AJAXMANAGER.youtubeVideoDetails(item.id.videoId,
						details => {
							track.length = parseDurationAsSeconds(details.items[0].contentDetails.duration);

							ytsnippet.attr('href', `https://www.youtube.com/watch?v=${item.id.videoId}`);
							ytsnippet.find('.youtube-video-title').text(item.snippet.title);
							ytsnippet.find('.youtube-video-length').text(formatSeconds(track.length));
							ytsnippet.find('.youtube-video-thumbnail').attr('src', item.snippet.thumbnails.default.url);

							VIEWMANAGER.view(3);
							const list = view.find('.track-analysis');
							list.empty();
							for(let entry of lyricsAnalysis(track, results.lyrics))
								list.append(`
									<li${entry.classes ? ` class="${entry.classes}"` : ''}>
										<span>${entry.title}</span>
										<span>${entry.html}</span>
									</li>`);
							prepareHideables();
						});
				}, () => {

				});

			} else {
				initErrorView("Sorry, there seem to be no lyrics available for that track.");
			}
		},
		() => initErrorView("<span class=\"fas fa-exclamation-circle\" style=\"font-size: 64px; margin: 32px;\"></span><br/>Sorry, it seems we either can't gather lyrics data at the moment, or we could find no lyrics for that track.")
	);
}

// Comparison

// Errors

function initErrorView(message) {
	VIEWMANAGER.view(5);
	$('#lyrics-error > p').html(message);
}

// Help

function displayHelp() {
	$('#lyrics-help').show().prop('hidden', false);
}

function hideHelp() {
	$('#lyrics-help').hide().prop('hidden', true);
}

// General

function handleHideableControls() {
	$('body').on('click', '.hideable .hideable-control', function() {
		const button = $(this);
		const container = button.closest('.hideable');
		if(container.attr('hideable-status') === 'shown') {
			container
				.attr('hideable-status', 'hidden')
				.find('.hideable-content').hide();
			button.find('.hideable-shown').prop('hidden', true).hide();
			button.find('.hideable-hidden').prop('hidden', false).show();
		} else {
			button.find('.hideable-shown').prop('hidden', false).show();
			button.find('.hideable-hidden').prop('hidden', true).hide();
			container
				.attr('hideable-status', 'shown')
				.find('.hideable-content').fadeIn(200);
		}
	});
}

function prepareHideables() {
	$('.hideable')
		.attr('hideable-status', 'hidden')
		.find('.hideable-control')
		.find('.hideable-shown').hide();
	$('.hideable .hideable-content').prop('hidden', true).hide();
}

function handleControls() {
	handleResultsViewControls();

	$('.lyrics-lookup').submit(function(evt) {
		evt.preventDefault();
		initLoadingView();
		TRACKMANAGER.clearCache();
		AJAXMANAGER.musixmatch('track.search', {q: $(this).find('input[name="query"]').val() },
			results => {
				if(results.message.header.status_code != 200) {
					initErrorView("<span class=\"fas fa-exclamation-circle\" style=\"font-size: 64px; margin: 32px;\"></span><br/>Sorry, we can't gather song data right now.");
					return;
				}
				initResultsView(results.message.body.track_list.map(t => new Track(t)));
			},
			() => initErrorView("<span class=\"fas fa-exclamation-circle\" style=\"font-size: 64px; margin: 32px;\"></span><br/>Error gathering song data."));
	});

	handleHideableControls();

	$('#lyrics-help-open').click(displayHelp);
	$('#lyrics-help-close').click(hideHelp);
	hideHelp();
}