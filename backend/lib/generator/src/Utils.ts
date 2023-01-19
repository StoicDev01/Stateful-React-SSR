
export function ArrayContains<T>(array : Array<T>, has : Array<T>){

    for (const h of has){
        if (array.indexOf(h) != -1){
            return true;
        }
    }

    return false;
}

export function clamp(value : number, min : number, max: number) : number{

    if (value < min){
        value = min
    }

    if (value > max){
        value = max
    }

    return value;
}

export interface ObjectData<T> {
    [key : string] : T;
}

export interface CanSave{
    save()  : void;
}

export function getCircularReplacer() {
    const seen = new WeakSet();

    return (key : string, value : unknown) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
      
    }
}

export interface LoadObject{
    loadPath : (path : string) => void;
    loadJson : (object : object) => void;
}

export interface LoadText {
    loadPath : (path : string) => void;
    loadText : (text : string) => void;
}

export interface toJson {
    toJson : () => object;
}

export interface toString {
    toString : () => string;
}