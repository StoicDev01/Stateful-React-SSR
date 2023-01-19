"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const markov_1 = require("./markov");
function syllableSplitter(word) {
    let syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
    return word.match(syllableRegex);
}
function prepareData(trainningText) {
    let data = [];
    let sentences = trainningText.split("\n");
    for (let sentence of sentences) {
        let words = sentence.split(" ");
        for (let word of words) {
            let syllables = syllableSplitter(word);
            if (syllables) {
                for (let syllable of syllables) {
                    data.push(syllable);
                }
            }
            // add spaces between words if is not the last one
            if (words.indexOf(word) != words.length - 1) {
                data.push(" ");
            }
        }
        data.push("\n");
    }
    return data;
}
let markov = new markov_1.Markov();
markov.addStates(["A", "B", "C", "D", "D", "C", "C", 'A']);
console.log(markov.generate(10));
//let trainningText = readFileSync("./data/USNames.txt", "utf-8")
//let trainningData = prepareData(trainningText);
