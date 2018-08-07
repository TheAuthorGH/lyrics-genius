function Track(data) {
	this.name = data.track.track_name;
	this.artist = data.track.artist_name;
	this.equals = function(other) {
		return this.name === other.name && this.artist === other.artist;
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
	maxSelected: function() {
		return this._maxSelected;
	},
	canSelect: function() {
		return this.maxSelected() > this.selected();
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