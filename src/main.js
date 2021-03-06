'use strict';

var extractLyrics = function extractLyrics(e) {
  e.preventDefault();

  var lyrics = getLyrics();
  var phrases = getPhrases(lyrics);
  var terms = getTerms(lyrics);
  var textFileContent = buildTextFileContent(terms, phrases);

  setUniqueCounters(terms, phrases);
  setTextFileLink(textFileContent);
};

var clearLyrics = function clearLyrics(e) {
  e.preventDefault();
  document.querySelector('#lyrics').value = "";
  document.querySelector('#phraseCount').innerHTML = "0";
  document.querySelector('#termCount').innerHTML = "0";
  document.querySelector("#text-file-link").href = "";
  document.querySelector('#download-button').disabled = true;
  document.querySelector("#text-file-link").href = "#";
};

var setTextFileLink = function setTextFileLink(textFileContent) {
  document.querySelector('#download-button').disabled = false;
  var link = document.querySelector("#text-file-link");
  link.href = "data:text/plan;charset=UTF-8," + encodeURIComponent(textFileContent);
  document.querySelector('#download-button').click();
};

var setUniqueCounters = function setUniqueCounters(terms, phrases) {
  document.querySelector('#phraseCount').innerHTML = phrases.length.toString();
  document.querySelector('#termCount').innerHTML = terms.length.toString();
};

// Utility functions

var removeDuplicates = function removeDuplicates(xs) {
  var collect = function collect(r, x) {
    if (!r.seen[x]) {
      r.result.push(x);
      r.seen[x] = true;
    }
    return r;
  };
  return xs.reduce(collect, { seen: {}, result: [] }).result;
};

var removeEmptyEntries = function removeEmptyEntries(arr) {
  return arr.filter(function (elem) {
    return elem.replace(/\s/g, '').length;
  });
};

var getPhrases = function getPhrases(lyrics) {
  lyrics = lyrics.trim();
  lyrics = lyrics.replace(/\t|\.|\,|\>|\<|\«|\»/gm, "");
  lyrics = lyrics.replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u200b\u202f\u205f\u3000\u0020]/gm, " ");
  var phrases = lyrics.split(/\n/gm);
  phrases = removeEmptyEntries(phrases);
  return removeDuplicates(phrases);
};

var getTerms = function getTerms(lyrics) {
  lyrics = lyrics.trim();
  lyrics = lyrics.replace(/\n|\r\n/gm, " ");
  lyrics = lyrics.replace(/\?|\!|\.|\,|\"|\>|\<|\«|\»/gm, "");
  lyrics = lyrics.replace(/[\u00A0\u1680\u180e\u2000-\u2009\u200a\u200b\u202f\u205f\u3000\u0020]/gm, " ");
  var terms = lyrics.split(/(\s+)/gm);
  terms = removeEmptyEntries(terms);
  return removeDuplicates(terms);
};

var getLyrics = function getLyrics() {
  var lyrics = document.querySelector('#lyrics').value;
  lyrics = lyrics.trim();
  lyrics = lyrics.replace(/\t|\.|\,/gm, "");
  return lyrics;
};

var buildTextFileContent = function buildTextFileContent(terms, phrases) {
  var textFileContent = "";
  var separator = "###############";

  textFileContent = textFileContent + separator + "\nTerms:\n" + separator + "\n\n";
  terms.forEach(function (elem) {
    textFileContent = textFileContent + elem + "\n";
  });

  textFileContent = textFileContent + "\n\n" + separator + "\nPhrases:\n" + separator + "\n\n";
  phrases.forEach(function (elem) {
    textFileContent = textFileContent + elem + "\n";
  });

  return textFileContent;
};

// EventListeners

document.querySelector('#clear-button').addEventListener('click', clearLyrics);

document.querySelector('#extract-button').addEventListener('click', extractLyrics);

document.querySelector('#lyrics').addEventListener('input', function () {
  document.querySelector('#download-button').disabled = true;
});
