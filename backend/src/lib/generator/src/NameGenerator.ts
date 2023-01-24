import { readFileSync } from "fs";
import Markov  from "./Markov.js"
import { LoadText } from "./Utils.js";



export default class NameGenerator implements LoadText{
    path : string;
    markov : Markov<string>;
    static syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;

    constructor(path:  string | undefined = undefined){
        this.markov = new Markov<string>();
        this.path = "";

        if (path){
            this.loadPath(path);
        }
    }

    loadPath(path : string){
        const trainningText = readFileSync(path, "utf8");
        const trainningData = this.prepareData(trainningText);
        this.markov.addStates(
            trainningData
        );
    }

    loadText(text: string){
        const trainningData = this.prepareData(text);
        this.markov.addStates(
            trainningData
        );
    }

    syllableSplitter(word : string){
        const syllableRegex = /[^aeiouy]*[aeiouy]+(?:[^aeiouy]*$|[^aeiouy](?=[^aeiouy]))?/gi;
        return word.match(syllableRegex);    
    }
    
    prepareData(trainningText : string){
        const data: string[]= [];
        const sentences = trainningText.split("\n");
    
        for (const sentence of sentences){
            const words = sentence.split(" ");
    
            for (const word of words){
                const syllables = this.syllableSplitter(word);
    
                if (syllables){
                    for (const syllable of syllables){
                        data.push(syllable);
                    }
                }
                
                // add spaces between words if is not the last one
                if (words.indexOf(word) != words.length -1){
                    data.push(" ");
                }
            }
    
            data.push("\n");
        }
    
        return data;
    }
    
    generate(max : number){
        let generated = this.markov.generate(max);
        let str  : string;

        if (!generated){
            generated = []
        }

        str = generated.join("");
        str = str.trim();
        return str.split("\n");
    }
}
