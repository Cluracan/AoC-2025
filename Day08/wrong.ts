import { readFileSync } from "fs";

class Node {
  x: number;
  y: number;
  z: number;
  id: string;
  edges: Set<string>;
  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.id = `${x},${y},${z}`;
    this.edges = new Set();
  }

  getDistance(node: Node) {
    return Math.sqrt(
      (this.x - node.x) ** 2 + (this.y - node.y) ** 2 + (this.z - node.z) ** 2
    );
  }

  isLinkedTo(node: Node) {
    return this.edges.has(node.id);
  }

  addLink(id: string) {
    this.edges.add(id);
  }
  getLinks() {
    return Array.from(this.edges);
  }
}

const findNearestNeighbour = (node: Node, nodeArray: Node[]) => {
  let minDistance = Infinity;
  let minId: string | null = null;
  for (let i = 0; i < nodeArray.length; i++) {
    const curNode = nodeArray[i];
    if (node.id === curNode.id || node.isLinkedTo(curNode)) {
      continue;
    }
    let curDistance = node.getDistance(curNode);
    if (curDistance < minDistance) {
      minDistance = curDistance;
      minId = curNode.id;
    }
  }
  return { minId, minDistance };
};

const findMinimumLink = (nodeArray: Node[]) => {
  let from: string;
  let to: string;
  let minLinkDistance = Infinity;
  for (let i = 0; i < nodeArray.length; i++) {
    const curNode = nodeArray[i];
    const { minId, minDistance } = findNearestNeighbour(curNode, nodeArray);
    if (minDistance < minLinkDistance) {
      minLinkDistance = minDistance;
      from = curNode.id;
      to = minId;
    }
  }
  return { from, to, minLinkDistance };
};

const getCircuits = (nodeArray: Node[]) => {
  const availableNodeIds = new Set(nodeArray.map((node) => node.id));
  const circuits: Set<string>[] = [];
  const insertNode = (
    node: Node,
    circuit: Set<string>,
    availableNodeIds: Set<string>
  ) => {
    if (!availableNodeIds.has(node.id)) {
      return;
    }
    circuit.add(node.id);
    availableNodeIds.delete(node.id);
    for (const nextNodeId of node.getLinks()) {
      const nextNodeIndex = nodeArray.findIndex(
        (node) => node.id === nextNodeId
      );
      const nextNode = nodeArray[nextNodeIndex];
      insertNode(nextNode, circuit, availableNodeIds);
    }
  };

  for (let i = 0; i < nodeArray.length; i++) {
    const curNode = nodeArray[i];
    if (!availableNodeIds.has(curNode.id)) {
      continue;
    }
    const circuit: Set<string> = new Set();
    insertNode(curNode, circuit, availableNodeIds);
    circuits.push(circuit);
  }
  return circuits;
};

const input = readFileSync("input.txt", "utf-8")
  .split(/\r\n/)
  .map((data) => {
    const [x, y, z] = data.split(",").map(Number);
    return new Node(x, y, z);
  });

const linkCount = 1000;

for (let i = 0; i < linkCount; i++) {
  if (i % 100 === 0) console.log(i);
  const { from, to } = findMinimumLink(input);
  const fromIndex = input.findIndex((node) => node.id === from);
  const toIndex = input.findIndex((node) => node.id === to);
  input[fromIndex].addLink(to);
  input[toIndex].addLink(from);
}
const circuits = getCircuits(input).sort((a, b) => b.size - a.size);
const total = circuits[0].size * circuits[1].size * circuits[2].size;
console.log(total);
console.log(circuits.length);
