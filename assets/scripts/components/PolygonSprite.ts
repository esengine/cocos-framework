import { Color, dynamicAtlasManager, IAssembler, IVertices, Mat4, Node, PolygonCollider2D, renderer, Sprite, UI, UITransform, Vec2, Vec3, _decorator } from "cc";
const { ccclass, property } = _decorator;

const vec3_temp = new Vec3();

const polygonAssembler: IAssembler = {

    createData(sprite: Sprite) {
        const renderData = sprite.requestRenderData();
        return renderData;
    },

    updateRenderData(sprite: PolygonSprite) {
        const renderData = sprite.renderData;
        if (renderData) {
            const vertices = sprite.vertices;
            if (vertices) {
                if (renderData.vertexCount !== vertices.x.length) {
                    renderData.vertexCount = vertices.x.length;

                    // 1 for world vertices, 2 for local vertices
                    renderData.dataLength = renderData.vertexCount * 2;

                    renderData.uvDirty = renderData.vertDirty = true;
                }
                renderData.indicesCount = vertices.triangles.length;

                if (renderData.uvDirty) {
                    this.updateUvs(sprite);
                }

                if (renderData.vertDirty) {
                    this.updateVertices(sprite);
                    this.updateWorldVertices(sprite);
                }
            }
        }
    },

    fillBuffers(sprite: PolygonSprite, renderer: any) {
        if (sprite === null) {
            return;
        }

        const vertices = sprite!.vertices;
        if (!vertices) {
            return;
        }

        // update world vertices
        this.updateWorldVertices(sprite);

        // buffer
        const buffer = renderer.acquireBufferBatch()!;
        let indicesOffset = buffer.indicesOffset;
        const vertexId: number = buffer.vertexOffset;

        const node = sprite.node;
        this.fillVerticesWithoutCalc3D(node, renderer, sprite.renderData!, sprite.color);

        // buffer data may be realloc, need get reference after request.
        const iBuf = buffer.iData!;
        const triangles = vertices.triangles;
        for (let i = 0, l = triangles.length; i < l; i++) {
            iBuf[indicesOffset++] = vertexId + (triangles[i] as number);
        }
    },

    fillVerticesWithoutCalc3D(node: Node, renderer: any, renderData: any, color: Color) {
        const dataList = renderData.data;
        let buffer = renderer.acquireBufferBatch()!;
        let vertexOffset = buffer.byteOffset >> 2;

        // buffer
        let vertexCount = renderData.vertexCount;
        let indicesOffset: number = buffer.indicesOffset;
        let vertexId: number = buffer.vertexOffset;
        const isRecreate = buffer.request(vertexCount, renderData.indicesCount);
        if (!isRecreate) {
            buffer = renderer.currBufferBatch!;
            vertexCount = 0;
            indicesOffset = 0;
            vertexId = 0;
        }

        // buffer data may be realloc, need get reference after request.
        const vBuf = buffer.vData!;

        for (let i = 0; i < vertexCount; i++) {
            const vert = dataList[i];
            vBuf[vertexOffset++] = vert.x;
            vBuf[vertexOffset++] = vert.y;
            vBuf[vertexOffset++] = vert.z;
            vBuf[vertexOffset++] = vert.u;
            vBuf[vertexOffset++] = vert.v;
            Color.toArray(vBuf, color, vertexOffset);
            vertexOffset += 4;
        }

        // buffer data may be realloc, need get reference after request.
        const iBuf = buffer.iData;
        iBuf![indicesOffset++] = vertexId;
        iBuf![indicesOffset++] = vertexId + 1;
        iBuf![indicesOffset++] = vertexId + 2;
        iBuf![indicesOffset++] = vertexId + 1;
        iBuf![indicesOffset++] = vertexId + 3;
        iBuf![indicesOffset++] = vertexId + 2;
    },

    updateVertices(sprite: PolygonSprite) {
        const node = sprite.node!;
        const uiTransform = node.getComponent(UITransform)!;
        const contentWidth = Math.abs(uiTransform.width);
        const contentHeight = Math.abs(uiTransform.height);
        const appX = uiTransform.anchorX * contentWidth;
        const appY = uiTransform.anchorY * contentHeight;

        const frame = sprite.spriteFrame!;
        const vertices = sprite!.vertices!;
        const x = vertices.x;
        const y = vertices.y;
        const originalWidth = frame.originalSize.width;
        const originalHeight = frame.originalSize.height;
        const rectWidth = frame.rect.width;
        const rectHeight = frame.rect.height;
        const offsetX: number = frame.offset.x;
        const offsetY: number = frame.offset.y;
        const trimX = offsetX + (originalWidth - rectWidth) / 2;
        const trimY = offsetY + (originalHeight - rectHeight) / 2;

        const scaleX = contentWidth / (sprite.trim ? rectWidth : originalWidth);
        const scaleY = contentHeight / (sprite.trim ? rectHeight : originalHeight);

        const renderData = sprite.renderData!;
        const data = renderData.data;

        if (!sprite.trim) {
            for (let i = 0, l: number = x.length; i < l; i++) {
                const vertex = data[i + l];
                vertex.x = (x[i]) * scaleX - appX;
                vertex.y = (originalHeight - y[i]) * scaleY - appY;
            }
        } else {
            for (let i = 0, l: number = x.length; i < l; i++) {
                const vertex = data[i + l];
                vertex.x = (x[i] - trimX) * scaleX - appX;
                vertex.y = (originalHeight - y[i] - trimY) * scaleY - appY;
            }
        }

        renderData.vertDirty = false;
    },

    updateWorldVertices(sprite: PolygonSprite) {
        const node = sprite.node;
        const renderData = sprite.renderData!;
        const data = renderData.data;

        node.updateWorldTransform();
        const matrix = node.worldMatrix;
        for (let i = 0, l: number = renderData.vertexCount; i < l; i++) {
            const local = data[i + l];
            const world = data[i];
            Vec3.set(vec3_temp, local.x, local.y, 0);
            Vec3.transformMat4(world, vec3_temp, matrix);
        }
    },

    updateUvs(sprite: PolygonSprite) {
        const vertices = sprite.vertices!;
        const u = vertices.nu;
        const v = vertices.nv;

        const renderData = sprite.renderData!;
        const data = renderData.data;
        for (let i = 0, l = u.length; i < l; i++) {
            const vertex = data[i];
            vertex.u = u[i];
            vertex.v = v[i];
        }

        renderData.uvDirty = false;
    },

};

@ccclass('PolygonSprite')
export class PolygonSprite extends Sprite {
    protected _vertices: IVertices | null = null;
    get vertices() {
        return this._vertices;
    }
    set vertices(value) {
        this._vertices = value;
        this.markForUpdateRenderData();
    }

    protected _flushAssembler() {
        let assembler = polygonAssembler;
        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData) {
                this._renderData = this._assembler.createData(this);
                this._renderData!.material = this.getRenderMaterial(0);
                this.markForUpdateRenderData();
                this._updateColor();
            }
        }
    }
}