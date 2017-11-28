const Line = require('./line')

/**
 * polygon-point collision
 * @param {number[]} points [x1, y1, x2, y2, ... xn, yn] of polygon
 * @param {number} x of point
 * @param {number} y of point
 */
function polygonPoint(points, x, y)
{
    const length = points.length
    let c = false
    for (let i = 0, j = length - 2; i < length; i += 2)
    {
        if (((points[i + 1] > y) !== (points[j + 1] > y)) && (x < (points[j] - points[i]) * (y - points[i + 1]) / (points[j + 1] - points[i + 1]) + points[i]))
        {
            c = !c
        }
        j = i
    }
    return c
}

function polygonLine(points, x1, y1, x2, y2)
{
    const length = points.length

    // check if first point is inside the shape (this covers if the line is completely enclosed by the shape)
    if (polygonPoint(points, x1, y1))
    {
        return true
    }

    // check for intersections for all of the sides
    for (let i = 0; i < length; i += 2)
    {
        const j = (i + 2) % length
        if (Line.lineLine(x1, y1, x2, y2, points[i], points[i + 1], points[j], points[j + 1]))
        {
            return true
        }
    }
    return false
}

/**
 * polygon-polygon collision
 * based on http://stackoverflow.com/questions/10962379/how-to-check-intersection-between-2-rotated-rectangles
 * @param {number[]} points1
 * @param {number[]} points2
 * @return {boolean}
 */
function polygonPolygon(points1, points2)
{
    const a = points1
    const b = points2
    const polygons = [a, b]
    let minA, maxA, projected, minB, maxB
    for (let i = 0; i < polygons.length; i++)
    {
        const polygon = polygons[i]
        for (let i1 = 0; i1 < polygon.length; i1 += 2)
        {
            var i2 = (i1 + 2) % polygon.length
            var normal = { x: polygon[i2 + 1] - polygon[i1 + 1], y: polygon[i1] - polygon[i2] }
            minA = maxA = null
            for (let j = 0; j < a.length; j += 2)
            {
                projected = normal.x * a[j] + normal.y * a[j + 1]
                if (minA === null || projected < minA)
                {
                    minA = projected
                }
                if (maxA === null || projected > maxA)
                {
                    maxA = projected
                }
            }
            minB = maxB = null
            for (let j = 0; j < b.length; j += 2)
            {
                projected = normal.x * b[j] + normal.y * b[j + 1]
                if (minB === null || projected < minB)
                {
                    minB = projected
                }
                if (maxB === null || projected > maxB)
                {
                    maxB = projected
                }
            }
            if (maxA < minB || maxB < minA)
            {
                return false
            }
        }
    }
    return true
}

module.exports = {
    polygonPoint,
    polygonLine,
    polygonPolygon
}