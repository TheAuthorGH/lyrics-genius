function wordArray(string) {
	return string.split(/[ ,!.";:\n\(\)-]+/).map(w => w.toLowerCase());
}

function charArray(string) {
	return string.split('').filter(c => !c.match(/[\(\);,\. "']/));
}

// Returns a new array with only unique elements.
function distinct(array, comparator) {
	comparator = comparator || function(a, b) {
		return a === b;
	};
	const result = [];
	for(let i of array)
		if(result.findIndex(o => comparator(o, i)) === -1) result.push(i);
	return result;
}

function occurrences(array, item) {
	return array.reduce((a, b) => a + (item === b), 0);
}

// Returns an array containing item-appearances mappings for an array.
function frequency(array) {
	const result = [];
	for(let i of distinct(array))
		result.push({item: i, frequency: occurrences(array, i)});
	return result.sort((a, b) => b.frequency - a.frequency);
}

function formatDecimal(number, precision) {
	return parseFloat(Math.round(number * 100) / 100).toFixed(precision);
}

function parseDurationAsSeconds(string) {
	const minutes = string.includes('M') ? Number(string.match(/[0-9]*M/)[0].replace('M', '')) : 0;
	const seconds = string.includes('S') ? Number(string.match(/[0-9]S/)[0].replace('S', '')) : 0;
	return minutes * 60 + seconds;
}

function formatSeconds(seconds) {
	let minutes = 0;
	while(seconds - 60 > 0) {
		seconds -= 60;
		minutes++;
	}
	return minutes + ':' + (seconds < 10 ? '0' + seconds : seconds);
}