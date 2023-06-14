//Code in this file courtesy of user "not luke#9330" on the Phaser discord
//Functions in this file are used for the curving cables in scene 2

const EPSILON = 1e-6;

function getCurve(a, p1, p2, offsetX, offsetY, segments) {
    const data = [
        [p1.x, a * Math.cosh((p1.x - offsetX) / a) + offsetY]
    ];
    const d = p2.x - p1.x;
    const length = segments - 1;
    for (let i = 0; i < length; i++) {
        const x = p1.x + (d * (i + 0.5)) / length;
        const y = a * Math.cosh((x - offsetX) / a) + offsetY;
        data.push([x, y]);
    }
    
    data.push([p2.x, a * Math.cosh((p2.x - offsetX) / a) + offsetY]);
    return data;
}

function getLineResult(data) {
    return {
        type: "line",
        start: data[0],
        lines: data.slice(1)
    };
}

function getCatenaryParameter(h, v, length, limit) {
    const m = Math.sqrt(length * length - v * v) / h;
    let x = Math.acosh(m) + 1;
    let prevx = -1;
    let count = 0;
    while (Math.abs(x - prevx) > EPSILON && count < limit) {
        prevx = x;
        x = x - (Math.sinh(x) - m * x) / (Math.cosh(x) - m);
        count++;
    }
    return h / (2 * x);
}

function getCurveResult(data) {
    let length = data.length - 1;
    let ox = data[1][0];
    let oy = data[1][1];
    const start = [data[0][0], data[0][1]];
    const curves = [];
    for (let i = 2; i < length; i++) {
        const x = data[i][0];
        const y = data[i][1];
        const mx = (x + ox) * 0.5;
        const my = (y + oy) * 0.5;
        curves.push([ox, oy, mx, my]);
        ox = x;
        oy = y;
    }
    length = data.length;
    curves.push([
        data[length - 1][0],
        data[length - 1][1],
        data[length - 2][0],
        data[length - 2][1]
    ]);
    return { type: "quadraticCurve", start, curves };
}

function getDistance(p1, p2) { 
    return Phaser.Math.Distance.Between(p1.x, p1.y, p2.x, p2.y);
}

function getCatenaryCurve(point1, point2, chainLength, options = {}) {
    const segments = options.segments || 25;
    const iterationLimit = options.iterationLimit || 6;

    const isFlipped = point1.x > point2.x;
    const p1 = isFlipped ? point2 : point1;
    const p2 = isFlipped ? point1 : point2;
    const distance = getDistance(p1, p2);
    if (distance < chainLength) {
        const diff = p2.x - p1.x;
        if (diff > 0.01) {
            const h = p2.x - p1.x;
            const v = p2.y - p1.y;
            const a = -getCatenaryParameter(h, v, chainLength, iterationLimit);
            const x = (a * Math.log((chainLength + v) / (chainLength - v)) - h) * 0.5;
            const y = a * Math.cosh(x / a);
            const offsetX = p1.x - x;
            const offsetY = p1.y - y;
            const curveData = getCurve(a, p1, p2, offsetX, offsetY, segments);
            if (isFlipped)
                curveData.reverse();
            return getCurveResult(curveData);
        }
        const mx = (p1.x + p2.x) * 0.5;
        const my = (p1.y + p2.y + chainLength) * 0.5;
        return getLineResult([
            [p1.x, p1.y],
            [mx, my],
            [p2.x, p2.y]
        ]);
    }
    return getLineResult([
        [p1.x, p1.y],
        [p2.x, p2.y]
    ]);
}