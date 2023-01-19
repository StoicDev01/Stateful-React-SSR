"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Character = exports.Name = exports.Choice = exports.randomChoice = exports.Number = void 0;
const Markov = require("@0x77/markov-typescript");
const fs_1 = require("fs");
class Number {
    static getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    static getRandomBoolean() {
        return Math.random() >= 0.5;
    }
}
exports.Number = Number;
function randomChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)];
}
exports.randomChoice = randomChoice;
class Choice {
    constructor(choices) {
        this.choices = choices;
    }
    generate() {
        return randomChoice(this.choices);
    }
}
exports.Choice = Choice;
class Name {
    constructor() {
        this.markov = new Markov.MarkovChain();
        this.trainningText = ``;
    }
    syllableSplitter(word) {
        return word.match(Name.syllableRegex);
    }
    prepareData() {
        let data = [];
        let sentences = this.trainningText.split("\n");
        for (let sentence of sentences) {
            let words = sentence.split(" ");
            let sentenceSyllables = [];
            for (let word of words) {
                let syllables = this.syllableSplitter(word);
                if (syllables) {
                    for (let syllable of syllables) {
                        sentenceSyllables.push(syllable);
                    }
                }
                // add spaces between words if is not the last one
                if (words.indexOf(word) != words.length - 1) {
                    sentenceSyllables.push(" ");
                }
            }
            data.push(sentenceSyllables);
        }
        return data;
    }
    setTrainText(text) {
        this.trainningText = text;
    }
    setTrainFile(path) {
        this.trainningText = (0, fs_1.readFileSync)(path, "utf-8");
    }
    train() {
        this.markov.learnAll(this.prepareData());
    }
    generate() {
        return this.markov.walk().join("");
    }
}
exports.Name = Name;
Name.syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
class Character {
    constructor(nameGenerator, props = null) {
        this.props = {
            name: "",
            description: "",
            age: 0,
            maxHeight: 0,
            gender: Character.Gender.Male,
            currentHeight: 0
        };
        if (props) {
            this.props = props;
        }
        this.maleNameGenerator = nameGenerator.male;
        this.femaleNameGenerator = nameGenerator.female;
    }
    generateDescription() {
        return `${this.props.name} is ${this.props.age} years old and ${this.props.maxHeight.toFixed(2)} meters tall.`;
    }
    execute() {
        let genderGenerator = new Choice([Character.Gender.Female, Character.Gender.Male]);
        this.props.gender = genderGenerator.generate();
        if (this.props.gender == Character.Gender.Male) {
            this.props.name = this.maleNameGenerator.generate();
        }
        else {
            this.props.name = this.femaleNameGenerator.generate();
        }
        this.props.age = Number.getRandomInt(5, 100);
        // calculate max height
        this.props.maxHeight = Number.getRandomFloat(1.40, 2.10);
        // calculate current height
        this.props.currentHeight = 50 + ((this.props.maxHeight - 50)) * (this.props.age / 18);
        // calculate height loss
        let height_los;
        this.props.description = this.generateDescription();
        return this.props;
    }
}
exports.Character = Character;
(function (Character) {
    let Gender;
    (function (Gender) {
        Gender["Female"] = "Female";
        Gender["Male"] = "Male";
    })(Gender = Character.Gender || (Character.Gender = {}));
})(Character = exports.Character || (exports.Character = {}));
