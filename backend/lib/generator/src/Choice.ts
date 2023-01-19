export function randomChoice<T>(choices : Array<T>) : T {
    return choices[ Math.floor(Math.random() * choices.length)]
}

export function multRandomChoice<T>(choices : Array<T>, max_choices=3, repeat=false) : Array<T >{
    const choosed : Array<T > = []
    const choicesCount = max_choices;

    for ( let choice = 0; choice < choicesCount; choice++){
        const randomchoice = randomChoice(choices);

        if (randomchoice != null){
            if (repeat == false && !choosed.includes(randomchoice))
                choosed.push(randomchoice);
            else if (repeat == true){
                choosed.push(randomchoice)
            }
        }
    }
    return choosed;
}