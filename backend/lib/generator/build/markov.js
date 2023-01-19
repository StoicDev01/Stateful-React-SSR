"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markov = exports.randomChoice = void 0;
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}
exports.randomChoice = randomChoice;
class Markov {
    constructor() {
        this.data = new Map();
        this.order = 3;
    }
    addStates(states) {
        // iterar por todos os estados
        for (let state of states) {
            // adicionar quantidade de vezes
            // que este estado aparece em data
            let nextState = states.at(states.indexOf(state) + 1);
            if (!this.data.get(state)) {
                this.data.set(state, [nextState]);
            }
            else {
                this.data.set(state, this.data.get(state).concat([nextState]));
            }
        }
    }
    walk(currentState = null) {
        if (!currentState) {
            // pegar um estado aleatório inicial
            currentState = randomChoice(Array.from(this.data.keys()));
        }
        // escolher o proximo baseado nas possibilidades
        let possibilites = this.data.get(currentState);
        let next = randomChoice(possibilites);
        return next;
    }
    generate(count = 10) {
        let lastState = null;
        let generatedStates = [];
        for (let x = 0; x < 10; x++) {
            let currentState;
            if (lastState) {
                currentState = this.walk(lastState);
            }
            else {
                currentState = this.walk();
            }
            generatedStates.push(currentState);
            lastState = currentState;
        }
    }
}
exports.Markov = Markov;
