"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickRandom = pickRandom;
exports.generateAttributes = generateAttributes;
const attributes_1 = require("../data/attributes");
// Get a single random item from an array
function pickRandom(array) {
    return array[Math.floor(Math.random() * array.length)];
}
// Get a shuffled copy of an array
function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}
// Get 0–3 unique random effects based on weighted chance
function pickRandomEffects() {
    const chance = Math.random();
    let count = 0;
    if (chance < 0.4)
        count = 0;
    else if (chance < 0.75)
        count = 1;
    else if (chance < 0.95)
        count = 2;
    else
        count = 3;
    if (count === 0)
        return undefined;
    const shuffled = shuffleArray(attributes_1.effects);
    return shuffled.slice(0, count);
}
// Generate a random hex color
function randomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;
}
// Main attribute generator
function generateAttributes(type) {
    const effects = pickRandomEffects();
    const selectedStyle = type === "Board" ? pickRandom(attributes_1.styles.boardStyles) : pickRandom(attributes_1.pieceStyles);
    const color = type === "Board" ? [randomHexColor(), randomHexColor()] : randomHexColor();
    const attributes = {
        name: `${selectedStyle} ${type}`,
        description: `${selectedStyle} ${type} featuring ${effects ? effects.join(", ") : "no effects"} for a unique experience.`,
        color,
        style: selectedStyle,
        filename: `${selectedStyle}_${Math.floor(Math.random() * 1000)}.json`
    };
    if (effects) {
        attributes.effect = effects;
    }
    return attributes;
}
