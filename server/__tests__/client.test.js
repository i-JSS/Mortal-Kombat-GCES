require('../../game/src/movement.js');

describe('Filters', () => {
    test('threshold simples', () => {
        const pixels = {
            data: new Uint8ClampedArray([100, 100, 100, 255, 200, 200, 200, 255]),
            width: 1,
            height: 2,
        };
        const result = window.Filters.threshold(pixels, 150);
        expect(result.data[0]).toBe(0);
        expect(result.data[4]).toBe(255);
    });
});
