"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let client = {
    nom: "Doe",
    age: 30,
    compterAge(age) {
        return this.age + age;
    }
};
let test = {
    nom: "Doe",
    age: 30,
    compterAge(age) {
        return this.age + age;
    }
};
let client2 = test;
console.log(client2);
//# sourceMappingURL=ClientController.js.map