import { readFileSync } from "fs";

interface Point {
  x: number;
  y: number;
}

interface Edge {
  start: Point;
  end: Point;
}

const getVertices = (a: Point, b: Point) => {
  const vertices: Point[] = [
    { x: a.x, y: a.y },
    { x: a.x, y: b.y },
    { x: b.x, y: a.y },
    { x: b.x, y: b.y },
  ];

  return vertices;
};

const isOnPolygonEdge = (point: Point, vertices: Point[]) => {
  let isOnEdge = false;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const start = vertices[i];
    const end = vertices[(i + 1) % n];
    const xStart = Math.min(start.x, end.x);
    const xEnd = Math.max(start.x, end.x);
    const yStart = Math.min(start.y, end.y);
    const yEnd = Math.max(start.y, end.y);
    if (
      xStart === xEnd &&
      point.x === xStart &&
      point.y >= yStart &&
      point.y <= yEnd
    ) {
      isOnEdge = true;
    } else if (point.y === yStart && point.x >= xStart && point.x <= xEnd) {
      isOnEdge = true;
    }
  }
  return isOnEdge;
};

const isInsidePolygon = (point: Point, vertices: Point[]) => {
  if (isOnPolygonEdge(point, vertices)) {
    return true;
  }
  let intersections = 0;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const start = vertices[i];
    const end = vertices[(i + 1) % n];
    if (start.x === end.x) {
      const yStart = Math.min(start.y, end.y);
      const yEnd = Math.max(start.y, end.y);
      if (point.x < start.x && point.y >= yStart && point.y < yEnd) {
        intersections++;
      }
    }
  }

  return intersections % 2 === 1;
};

const orderVertices = (a: Point, b: Point) => {
  if (a.x === b.x) {
    return a.y < b.y ? { start: a, end: b } : { start: b, end: a };
  } else {
    return a.x < b.x ? { start: a, end: b } : { start: b, end: a };
  }
};

const getRectEdges = (vertices: Point[]): Edge[] => {
  const edges = [];
  for (let i = 0; i < 4; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % 4];
    const { start, end } = orderVertices(a, b);

    edges.push({ start, end });
  }
  return edges;
};

const isHorizontal = ({ start, end }: Edge) => {
  return start.y === end.y;
};

const intersectsPolygonEdge = (rectEdge: Edge, vertices: Point[]) => {
  let intersectsEdge = false;
  const n = vertices.length;
  for (let i = 0; i < n; i++) {
    const a = vertices[i];
    const b = vertices[(i + 1) % n];
    const polyEdge = orderVertices(a, b);
    if (
      (isHorizontal(rectEdge) && isHorizontal(polyEdge)) ||
      (!isHorizontal(rectEdge) && !isHorizontal(polyEdge))
    ) {
      continue;
    }
    if (isHorizontal(rectEdge)) {
      const rectY = rectEdge.start.y;
      const polyX = polyEdge.start.x;
      if (
        rectY > polyEdge.start.y &&
        rectY < polyEdge.end.y &&
        rectEdge.start.x < polyX &&
        rectEdge.end.x > polyX
      ) {
        intersectsEdge = true;
      }
    } else {
      const rectX = rectEdge.start.x;
      const polyY = polyEdge.start.y;
      if (
        rectX > polyEdge.start.x &&
        rectX < polyEdge.end.x &&
        rectEdge.start.y < polyY &&
        rectEdge.end.y > polyY
      ) {
        intersectsEdge = true;
      }
    }
  }
  return intersectsEdge;
};

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((line) => {
    const [x, y] = line.split(",").map(Number);
    return { x, y };
  });

let maxArea = 0;

for (let i = 0; i < input.length; i++) {
  for (let j = i + 1; j < input.length; j++) {
    const width = Math.abs(input[i].x - input[j].x) + 1;
    const height = Math.abs(input[i].y - input[j].y) + 1;
    const area = width * height;

    if (area > maxArea) {
      const rectangleVertices = getVertices(input[i], input[j]);
      const rectangleEdges = getRectEdges(rectangleVertices);

      if (
        rectangleVertices.every((vertex) => isInsidePolygon(vertex, input)) &&
        rectangleEdges.every((edge) => !intersectsPolygonEdge(edge, input))
      ) {
        maxArea = area;
      }
    }
  }
}

// const test = getEdges({ x: 9, y: 5 }, { x: 2, y: 3 });
// console.log(test);

// test.forEach((point) => {
//   console.log(point);
//   console.log(isInsidePolygon(point, input));
// });

console.log(maxArea);

/*
function isPointInOrthogonalPolygon(point P, vertices V):
    intersections = 0
    n = length(V)

    for i from 0 to n-1:
        A = V[i]
        B = V[(i + 1) % n] // Next vertex, wrap around at the end

        // Check only vertical edges
        if A.x == B.x:
            // Ensure A is the lower point for consistent comparison
            if A.y > B.y:
                temp = A
                A = B
                B = temp
            
            // Check if the ray to the right of P crosses this vertical segment
            if P.x < A.x and P.y >= A.y and P.y < B.y:
                intersections = intersections + 1

    // If the count is odd, the point is inside
    return intersections % 2 == 1
*/
