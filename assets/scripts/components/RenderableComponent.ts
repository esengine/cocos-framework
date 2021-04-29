import { math, Material, Camera, Rect, clamp01, Collider, Vec2 } from "cc";
import { Batcher } from "../graphics/Batcher";
import { IRenderable } from "./IRenderable";

export abstract class RenderableComponent extends es.Component implements IRenderable {
    public get width() {
        return this.bounds.width;
    }
    public get height() {
        return this.bounds.height;
    }

    public get bounds(): es.Rectangle {
        if (this._areBoundsDirty) {
            this._bounds.calculateBounds(this.entity.transform.position, this._localOffset, es.Vector2.zero,
                this.entity.transform.scale, this.entity.transform.rotation, this.width, this.height);
            this._areBoundsDirty = false;
        }
        return this._bounds;
    }
    public get layerDepth(): number {
        return this._layerDepth;
    }

    public set layerDepth(value: number) {
        this.setLayerDepth(value);
    }
    public get renderLayer(): number {
        return this._renderLayer;
    }

    public set renderLayer(value: number) {
        this.setRenderLayer(value);
    }

    public material!: Material;

    public get isVisible(): boolean {
        return this._isVisible;
    }
    public set isVisible(value: boolean) {
        if (this._isVisible != value) {
            this._isVisible = value;

            if (this._isVisible)
                this.onBecameVisible();
            else
                this.onBecameInVisible();
        }
    }

    public debugRenderEnabled: boolean = true;

    protected _localOffset!: es.Vector2;
    protected _layerDepth!: number;
    protected _renderLayer!: number;
    protected _bounds!: es.Rectangle;
    protected _isVisible!: boolean;
    protected _areBoundsDirty: boolean = true;

    onEntityTransformChanged(comp: transform.Component) {
        this._areBoundsDirty = true;
    }

    public setLayerDepth(layerDepth: number): RenderableComponent {
        this._layerDepth = clamp01(layerDepth);

        return this;
    }

    public setRenderLayer(renderLayer: number): RenderableComponent {
        if (renderLayer != this._renderLayer) {
            this._renderLayer = renderLayer;
        }

        return this;
    }

    protected onBecameVisible() {

    }

    protected onBecameInVisible() {

    }

    getMaterial<T extends Material>(): T {
        return this.material as T;
    }

    isVisibleFromCamera(camera: Camera): boolean {
        this.isVisible = camera.rect.intersects(new Rect(this.bounds.x, this.bounds.y, this.width, this.height));
        return this.isVisible;
    }

    public setMaterial(material: Material) {
        this.material = material;

        return this;
    }

    public abstract render(batch: Batcher, camera: Camera): void;

    debugRender(batch: Batcher): void {
        if (!this.debugRenderEnabled)
            return;
    }
}