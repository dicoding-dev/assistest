describe("Sum test", ()=> {
    it('should sum 2 numbers properly', function () {
        const total = 2 + 2;
        expect(total).toStrictEqual(4)
    });

    it('should subtract 2 numbers properly', function () {
        const total = 2 - 2;
        expect(total).toStrictEqual(0)
    });

    it('should div 2 numbers properly', function () {
        const total = 2 / 2;
        expect(total).toStrictEqual(1)
    });
})