function Track(data) {
	if(data.track) {
		this.name = data.track.track_name;
		this.artist = data.track.artist_name.replace('Made famous by', '');
	} else {
		this.name = "Unknown Name";
		this.artist = "Unknown Artist";
	}
	this.equals = function(other) {
		return this.name === other.name && this.artist === other.artist;
	}
}

const TRACKMANAGER = {
	_cached: [],
	cache: function(track) {
		if(track && !this.cached(track)) {
			this._cached.push(track);
			return this.cached();
		} else if(this.cached(track)) {
			return this._cached.findIndex(t => track.equals(t));
		}
	},
	undoCache: function(track) {
		if(track)
			this._cached.splice(this._cached.indexOf(track), 1);
	},
	cached: function(arg) {
		if(typeof arg === 'number' || typeof arg === 'string')
			return this._cached[arg];
		else if(typeof arg === 'object')
			return Boolean(this._cached.find(t => t.equals(arg)));
		return this._cached.length;
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