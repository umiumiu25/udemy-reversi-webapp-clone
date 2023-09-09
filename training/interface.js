const STONE = 0;
const PAPER = 1;
const SCISSORS = 2;
class RandomHandGenerator {
    generate() {
        return Math.floor(Math.random() * 3);
    }
    generateArray() {
        return [];
    }
}
class Janken {
    play(handGenerator) {
        // const handGenerator = new RandomHandGenerator();
        const computerHand = handGenerator.generate();
        console.log(`computerHand = ${computerHand}`);
        // 勝敗判定などが続く...
    }
}
const janken = new Janken;
const generator = new RandomHandGenerator;
janken.play(generator);
class StoneHandGenerator {
    generate() {
        return STONE;
    }
}
const generator2 = new StoneHandGenerator;
janken.play(generator2);
export {};
