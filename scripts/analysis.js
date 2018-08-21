function lyricsAnalysis(track, text) {
	function entry(title, html, classes) {
		return {title: title, html: html, classes: classes};
	};

	const words = wordArray(text);
	const wordsUnique = distinct(words);
	const wordFrequency = frequency(words);
	const chars = charArray(text);
	const charFrequency = frequency(chars);
	const lengthAvailable = track.length !== undefined;

	return [
		entry('Track Name', track.name),
		entry('Track Author', track.artist),
		entry('Lyrics', `
			<button class="hideable-control"><span class="hideable-hidden">Show</span><span class="hideable-shown">Hide</span></button>
			<p class="hideable-content track-lyrics">${text.replace(new RegExp('\n', 'g'), '<br>')}</p>
		`, 'hideable column'),
		entry('Estimated Duration', lengthAvailable ? formatSeconds(track.length) : 'Unavailable'),
		entry('Words', words.length),
		entry('Words (Unique)', wordsUnique.length),
		entry('Monotony', formatDecimal(words.length / wordsUnique.length, 2)),
		entry('Common Words', `
			<button class="hideable-control"><span class="hideable-hidden">Show</span><span class="hideable-shown">Hide</span></button>
			<table class="hideable-content">
				<tr><th>Word</th><th>Count</th></tr>
				${wordFrequency.slice(0, 10).reduce((e, f) => e + ('<tr><td>' + f.item + '</td><td>' + f.frequency + '</td></tr>'), '')}
			</table>
		`, 'hideable column'),
		entry('Characters', chars.length),
		entry('Most Common Character', charFrequency[0].item),
		entry('Words per Minute', lengthAvailable ? formatDecimal(words.length/(track.length / 60), 2) : 'N/A')
	];
}