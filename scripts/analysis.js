function lyricsAnalysis(text) {
	const data = {};
	const words = text.split(" ");
	const chars = text.split('');
	data.words.count = words.length;
	data.characters.array = chars.length;
	return data;
}