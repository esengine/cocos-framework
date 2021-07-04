import { find, gfx, instantiate, Material, MeshRenderer, PrimitiveType, resources, SpriteFrame, UITransform } from "cc";
import { PolygonSprite } from "./PolygonSprite";

export class Mesh extends es.RenderableComponent {
    public getbounds() {
        if (this._areBoundsDirty) {
            this._bounds.calculateBounds(this.entity.transform.position.add(this._topLeftVertPosition), es.Vector2.zero,
                es.Vector2.zero, this.entity.transform.scale, this.entity.transform.rotation, this._width, this._height);
            this._areBoundsDirty = false;
        }

        return this._bounds;
    }

    _vertexColorEnabled: boolean = true;
    _texture: PolygonSprite | null = null;

    _primitiveCount: number = 0;
    _topLeftVertPosition: es.Vector2 = new es.Vector2();
    _width: number = 0;
    _height: number = 0;
    _triangles: number[] = [];
    _verts: { position: es.Vector2, color: es.Color }[] = [];
    _nu: number[] = [];
    _nv: number[] = [];
    _material: Material | null = null;

    public recalculateBounds(recalculateUVs: boolean): Mesh {
        this._topLeftVertPosition = new es.Vector2(Number.MAX_VALUE, Number.MAX_VALUE);
        const max = new es.Vector2(Number.MIN_VALUE, Number.MIN_VALUE);

        for (let i = 0; i < this._verts.length; i++) {
            this._topLeftVertPosition.x = Math.min(this._topLeftVertPosition.x, this._verts[i].position.x);
            this._topLeftVertPosition.y = Math.min(this._topLeftVertPosition.y, this._verts[i].position.y);
            max.x = Math.max(max.x, this._verts[i].position.x);
            max.y = Math.max(max.y, this._verts[i].position.y);
        }

        this._width = max.x - this._topLeftVertPosition.x;
        this._height = max.y - this._topLeftVertPosition.y;
        this._areBoundsDirty = true;

        if (recalculateUVs) {
            const uiTransform = this._texture?.getComponent(UITransform);
            if (uiTransform)
                for (let i = 0; i < this._verts.length; i++) {
                    this._nu[i] = (this._verts[i].position.x / uiTransform.width);
                    this._nv[i] = (this._verts[i].position.y / uiTransform.height);
                }
        }

        return this;
    }

    public setTexture(texture: PolygonSprite) {
        this._texture = texture;
        return this;
    }

    public setVertexColorEnabled(shouldEnableVertexColors: boolean) {
        if (this._material != null) {
            this._material.recompileShaders({ "USE_VERTEX_COLOR": this._vertexColorEnabled });
        } else {
            this._vertexColorEnabled = shouldEnableVertexColors;
        }
    }

    public setVertPositions(positions: es.Vector2[]) {
        const createVerts = this._verts == null || this._verts.length != positions.length;
        if (createVerts) {
            for (let i = 0; i < positions.length; i++) {
                this._verts[i] = {
                    position: positions[i],
                    color: this.color
                };
            }
        }

        return this;
    }

    public setTriangles(triangles: number[]) {
        es.Insist.isTrue(triangles.length % 3 == 0, "triangles must be a multiple of 3");
        this._primitiveCount = triangles.length / 3;
        this._triangles = triangles;
        return this;
    }

    public setColor(color: es.Color) {
        this.color = color;
        this.setColorForAllVerts(color);
        return this;
    }

    public setColorForAllVerts(color: es.Color) {
        for (let i = 0; i < this._verts.length; i++)
            this._verts[i].color = color;
        return this;
    }

    onAddedToEntity() {
        resources.load("materials/Basic", Material, (err, data) => {
            if (this._texture != null) {
                this._texture.material = data;
                this._material = this._texture?.node.getComponent(MeshRenderer)?.getMaterialInstance(0)!;
                find('Canvas_UI')?.addChild(this._texture.node);

                this._material?.recompileShaders({ "USE_VERTEX_COLOR": this._vertexColorEnabled });
            }
        });
    }

    onRemovedFromEntity() {
        this._texture?.node.removeFromParent();
        this._texture = null;
    }

    render(batcher: es.IBatcher, camera: es.ICamera): void {
        if (this._texture) {
            this._texture.vertices = {
                x: this._topLeftVertPosition.x,
                y: this._topLeftVertPosition.y,
                triangles: this._triangles,
                nu: this._nu,
                nv: this._nv,
                u: [],
                v: []
            }
        }
    }
}