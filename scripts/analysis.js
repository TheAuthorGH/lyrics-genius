function wordArray(string) {
	return string.split(' ');
}

function charArray(string) {
	return string.split('');
}

function lyricsAnalysis(text) {
	function entry(title, html) {
		return {title: title, html: html};
	};
	const data = [];
	const words = wordArray(text);
	const chars = charArray(text);
	data.push(entry('Word Count', words.length));
	data.push(entry('Character Count', chars.length));
	return data;
}