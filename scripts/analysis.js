function lyricsAnalysis(text) {
	function entry(title, html) {
		return {title: title, html: html};
	};
	const words = wordArray(text);
	const wordsUnique = distinct(words);
	const chars = charArray(text);
	return [
		entry('Words', words.length),
		entry('Words (Unique)', wordsUnique.length),
		entry('Monotony', formatDecimal(words.length / wordsUnique.length, 2)),
		entry('Most Frequent Word', frequency(words)[0].item),
		entry('Characters', chars.length)
	];
}