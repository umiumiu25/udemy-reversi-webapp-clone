const v1: number = 1;
console.log(v1);

let v2: number = 2;
// v2 = 'hello';
console.log(v2);

let v3 = 3;
console.log(v3);

let v4 = 4;
// v4 = 'hello';
console.log(v4);

let v5: number | string = 5;
v5 = 'hello';
console.log(v5);

const arr1: number[] = [];
arr1.push(1);
console.log(arr1);

let v6: any[];
// v6 = 1;
// v6 = new Date;
v6 = [1, 'hello', new Date];
console.log(v6);