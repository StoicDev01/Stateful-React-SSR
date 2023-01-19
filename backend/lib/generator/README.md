# GENERATORS
This is a library with various Generators builtin, this includes: Character Generator, Description, Numbers Generator, Name Generator, and much more on the future.

Each object generator can have a base, this base is the configuration in wich the generator will generate, you can see all character bases on : /data/character/bases

## CHARACTER GENERATOR

### import dependencies
```typescript
import Character from "./Character"
import NameGenerator from "./NameGenerator";
import CharacterBase from "./CharacterBase"
import { CharacterDescription } from "./Description";
```

### Create generators
```typescript 
const nameGenerator = new NameGenerator("./data/character/names/FantasyNames.txt")

// Create character Base and pass configurations
const base = new CharacterBase("./data/character/bases/contemporany.json", {
    nameGenerators : {
        neuter : nameGenerator
    }
});

const character = new Character(base);
const description = new CharacterDescription(character);
```

### Generate Character
```typescript 
character.generate();
```
You can see the character data with character.data

### Generate Description
```typescript
description.generate();
```

You can see the generated description
```typescript
description.toString();
/*
Main_Attributes
gail of Vanaheim is a 43.3 year old woman. she is a Lawyer, she is 1.65 meters tall and weighs 56.5 kilograms.
she has Black hair, Green eyes and a oblong face shape, gail of Vanaheim has a Olive skin tone and a athletic body type.


she is a lawyer, and her job involves representing clients in legal matters and providing 
...
*/
```

Or you can save on a file
```typescript
description.saveStr("./output.txt");
```
