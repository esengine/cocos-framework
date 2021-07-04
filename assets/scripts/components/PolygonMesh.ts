import { Mesh } from "./Mesh";

export class PolygonMesh extends Mesh {
    constructor(points: es.Vector2[], arePointsCCW: boolean = true) {
        super();

        const triangulator = new es.Triangulator();
        triangulator.triangulate(points, arePointsCCW);

        this.setVertPositions(points);
        this.setTriangles(triangulator.triangleIndices);
    }
}