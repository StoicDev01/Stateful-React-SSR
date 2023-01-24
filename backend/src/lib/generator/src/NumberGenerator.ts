export default class NumberGenerator {
    public static getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public static getRandomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static getRandomBoolean(): boolean {
        return Math.random() >= 0.5;
    }

    public static gaussianDist(med : number, variation : number){
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return med + variation * z;
    }
}