import { Color, Graphics, Rect, Vec2, view } from "cc";
import { Batcher } from "../graphics/Batcher";
import { IRenderable } from "../graphics/IRenderable";
import { SceneEmitType, Scene_Game } from "../Scene_Game";
import { component_camera } from "./component_camera";

export abstract class component_render extends es.Component implements IRenderable {
    public getwidth() {
        return this.bounds.width;
    }

    public getheight() {
        return this.bounds.height;
    }

    protected _bounds: es.Rectangle = new es.Rectangle();
    public get bounds(): es.Rectangle {
        if (this._areBoundsDirty) {
            this._bounds.calculateBounds(this.entity.transform.position, this._localOffset, new es.Vector2(this.getwidth() / 2, this.getheight() / 2),
                this.entity.transform.scale, this.entity.transform.rotation, this.getwidth(), this.getheight());
            this._areBoundsDirty = false;
        }
        return this._bounds;
    }
    protected _areBoundsDirty: boolean = true;

    public get renderLayer() {
        return this._renderLayer;
    }
    public set renderLayer(value: number) {
        this.setRenderLayer(value);
    }

    protected _renderLayer: number = 0;

    public onEntityTransformChanged(comp: transform.Component) {
        this._areBoundsDirty = true;
        Scene_Game.emitter.emit(SceneEmitType.graphics_dirty);
    }

    onAddedToEntity() {
        if (this.entity.scene instanceof Scene_Game) {
            this.entity.scene.renderableComponents.add(this);
        }
    }

    onRemovedFromEntity() {
        if (this.entity.scene instanceof Scene_Game) {
            this.entity.scene.renderableComponents.remove(this);
        }
    }

    public get localOffset() {
        return this._localOffset;
    }
    public set localOffset(value: es.Vector2) {
        this.setLocalOffset(value);
    }

    public setLocalOffset(offset: es.Vector2) {
        if (!this._localOffset.equals(offset)) {
            this._localOffset = offset;
            this._areBoundsDirty = true;
        }

        return this;
    }

    public get isVisible() {
        return this._isVisible;
    }

    public set isVisible(value: boolean) {
        if (this._isVisible != value) {
            this._isVisible = value;

            if (this._isVisible) {
                this.onBecameVisible();
            } else {
                this.onBecameInvisible();
            }
        }
    }

    public debugRenderEnabled: boolean = true;

    protected _isVisible: boolean = false;
    protected _localOffset: es.Vector2 = new es.Vector2();

    public abstract render(batcher: Batcher, camera: component_camera): void;

    protected onBecameVisible() {

    }

    protected onBecameInvisible() {
        
    }

    public setRenderLayer(renderLayer: number): component_render {
        if (renderLayer != this._renderLayer) {
            let oldRenderLayer = this._renderLayer;
            this._renderLayer = renderLayer;

            if (this.entity != null && this.entity.scene != null && es.Core.scene instanceof Scene_Game)
                es.Core.scene.renderableComponents.updateRenderableRenderLayer(this, oldRenderLayer, this._renderLayer);
        }

        return this;
    }

    public isVisibleFromCamera(cam: component_camera): boolean {
        this.isVisible = cam.bounds.intersects(this.bounds);

        return this.isVisible;
    }

    public debugRender(batcher: Batcher) {
        if (!this.debugRenderEnabled)
            return;

        batcher.drawHollowRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, new Color(255, 255, 0));
        batcher.end();
        
        batcher.drawPixel(es.Vector2.add(this.entity.transform.position, this._localOffset), new Color(153, 50, 204), 4);
        batcher.end();
    }
}