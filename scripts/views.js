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
		initErrorView('Sorry, no results found! Please try something different!');
		return;
	}
	for(let track of results) {
		view.append(`
			<li trackid="${TRACKMANAGER.cache(track) - 1}">
				<div class="track-meta">
					<span class="track-name">${track.name}</span>
					<span class="track-artist">${track.artist}</span>
				</div>
				<div>
					<button class="track-select" aria-label="select track for comparison"><span class="fas fa-plus"></span></button>
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
		.on('click', '.track-meta', function() {
			initAnalysisView(TRACKMANAGER.cached($(this).closest('li').attr('trackid')));
		});
}

// Analysis

function initAnalysisView(track) {
	VIEWMANAGER.view(3);
	const view = $('#lyrics-analysis');
	view.find('.track-name').text(track.name)
		.find('.track-artist').text(track.artist);
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