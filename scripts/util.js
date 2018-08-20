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

function formatDecimal(precision) {
	return parseFloat(Math.round(precision * 100) / 100).toFixed(precision);
}