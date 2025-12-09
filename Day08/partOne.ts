import { link, readFileSync } from "fs";

interface Link {
  distance: number;
  fromId: string;
  toId: string;
}

class Node {
  x: number;
  y: number;
  z: number;
  id: string;
  links: Node[];
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = `${x},${y},${z}`;
    this.links = [];
  }

  getDistance(node: Node) {
    return Math.sqrt(
      (this.x - node.x) ** 2 + (this.y - node.y) ** 2 + (this.z - node.z) ** 2
    );
  }

  isLinkedTo(node: Node) {
    return this.links.some((link) => link.id === node.id);
  }

  addLink(node: Node) {
    this.links.push(node);
  }
  getLinks() {
    return this.links;
  }
}

const findNearestNeighbour = (node: Node, nodeArray: Node[]) => {
  let minDistance = Infinity;
  let minNode: Node | null = null;
  for (let i = 0; i < nodeArray.length; i++) {
    const curNode = nodeArray[i];
    if (node.id === curNode.id || node.isLinkedTo(curNode)) {
      continue;
    }
    let curDistance = node.getDistance(curNode);
    if (curDistance < minDistance) {
      minDistance = curDistance;
      minNode = curNode;
    }
  }
  return { minNode, minDistance };
};

const getLinks = (nodeArray: Node[]) => {
  const links: Link[] = [];
  for (let i = 0; i < nodeArray.length; i++) {
    for (let j = i + 1; j < nodeArray.length; j++) {
      const fromNode = nodeArray[i];
      const toNode = nodeArray[j];
      const distance = fromNode.getDistance(toNode);
      links.push({ distance, fromId: fromNode.id, toId: toNode.id });
    }
  }
  links.sort((a, b) => a.distance - b.distance);
  return links;
};

const getCircuits = (nodeArray: Node[]) => {
  return nodeArray.map((node) => new Set([node.id]));
};

const addLinks = (
  linkCount: number,
  links: Link[],
  circuits: Set<string>[]
) => {
  for (let i = 0; i < linkCount; i++) {
    const { fromId, toId } = links[i];
    const fromCircuitIndex = circuits.findIndex((circuit) =>
      circuit.has(fromId)
    );
    const toCircuitIndex = circuits.findIndex((circuit) => circuit.has(toId));
    if (fromCircuitIndex === toCircuitIndex) {
      continue;
    }
    const fromCircuit = circuits[fromCircuitIndex];
    const toCircuit = circuits[toCircuitIndex];
    const newCircuits = circuits.filter(
      (circuit) => !circuit.has(fromId) && !circuit.has(toId)
    );
    const linkedCircuit = fromCircuit.union(toCircuit);
    newCircuits.push(linkedCircuit);
    circuits = newCircuits;
  }
  return circuits;
};

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((data) => {
    const [x, y, z] = data.split(",").map(Number);
    return new Node(x, y, z);
  });

const links = getLinks(input);
let circuits = getCircuits(input);
const result = addLinks(1000, links, circuits).sort((a, b) => b.size - a.size);

console.log(result[0].size * result[1].size * result[2].size);
