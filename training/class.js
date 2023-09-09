class Fraction {
    _numerator;
    _denominator;
    constructor(_numerator, _denominator) {
        this._numerator = _numerator;
        this._denominator = _denominator;
    }
    add(other) {
        const resultNumerator = this._numerator * other.denominator + this._denominator * other.numerator;
        const resultDenominator = this._denominator * other.denominator;
        return new Fraction(resultNumerator, resultDenominator);
    }
    toString() {
        return `${this._numerator}/${this._denominator}`;
    }
    get numerator() {
        return this._numerator;
    }
    get denominator() {
        return this._denominator;
    }
}
const f1 = new Fraction(1, 2);
console.log(f1.numerator);
console.log(f1.denominator);
// f1.numerator = 3;
console.log(f1.numerator);
const f2 = new Fraction(1, 3);
console.log(f2.toString());
const result = f1.add(f2);
console.log(result.toString());
export {};
// const errResult = f1.minus(f2);
