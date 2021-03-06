const { remove: removeDiacritics } = require('diacritics');
const porExtenso = require('por-extenso');
const { ansiEscapeCodes, zeroWidthCharacters } = require('printable-characters');
// eslint-disable-next-line import/no-unresolved
const { metaphone: metaphoneNative } = require('bindings')('addon');

const companyRule = /\s(SA|LTDA|MEI|ME|EPP|EIRELI)(\s|$)/ig;
const nonCharOrSpace = /[^\w ]/ig;

function metaphone(text, additionalPhases = [
  [companyRule, ''],
], limit = 255) {
  if (typeof text !== 'string') return null;
  if (text.length > limit) return null;
  let userText = removeDiacritics(porExtenso(text
    .replace(ansiEscapeCodes, ' ')
    .replace(zeroWidthCharacters, ' ')))
    .toLowerCase()
    .replace(nonCharOrSpace, '');

  if (additionalPhases) {
    additionalPhases.forEach(([from, to]) => {
      userText = userText.replace(from, to);
    });
  }
  if (!userText.length) {
    return null;
  }
  return metaphoneNative(userText);
}

metaphone.companyRules = companyRule;
module.exports = metaphone;
