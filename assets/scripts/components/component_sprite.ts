import { find, Graphics, Size, Sprite, UITransform, utils, Vec2, Vec3 } from "cc";
import { Batcher } from "../graphics/Batcher";
import { SceneEmitType, Scene_Game } from "../Scene_Game";
import { component_camera } from "./component_camera";
import { component_render } from "./component_render";

export class component_sprite extends component_render implements es.IUpdatable {
    public get bounds() {
        if (this._areBoundsDirty) {
            if (this._sprite.spriteFrame != null) {
                this._bounds.calculateBounds(this.entity.transform.position, this._localOffset, this._origin,
                    this.entity.transform.scale, this.entity.transform.rotation, 
                    this.getwidth(), this.getheight());
            }
            this._areBoundsDirty = false;
        }

        return this._bounds;
    }

    public getwidth() {
        const ui_transform = this._sprite.getComponent(UITransform);
        if (!ui_transform)
            return 0;

        return ui_transform.width;
    }

    public getheight() {
        const ui_transform = this._sprite.getComponent(UITransform);
        if (!ui_transform)
            return 0;

        return ui_transform.height;
    }

    public get origin() {
        return this._origin;
    }
    public set origin(value: es.Vector2) {
        this.setOrigin(value);
    }
    public setOrigin(origin: es.Vector2) {
        if (!this._origin.equals(origin)) {
            this._origin = origin;
            this._areBoundsDirty = true;
        }

        return this;
    }

    public get sprite() {
        return this._sprite;
    }
    public set sprite(value: Sprite) {
        this.setSprite(value);
    }

    public get originNormalized() {
        return new es.Vector2(this._origin.x / this.getwidth() * this.entity.transform.scale.x,
            this._origin.y / this.getheight() * this.entity.transform.scale.y);
    }
    public set originNormalized(value: es.Vector2) {
        this.setOrigin(new es.Vector2(value.x * this.getwidth() / this.entity.transform.scale.x,
            value.y * this.getheight() / this.entity.transform.scale.y));
    }

    protected _origin: es.Vector2 = new es.Vector2();
    protected _sprite!: Sprite;

    constructor(sprite: Sprite) {
        super();
        this.setSprite(sprite);
    }

    onAddedToEntity() {
        super.onAddedToEntity();
        if (!this._sprite.node.parent)
            find('Canvas')?.addChild(this._sprite.node);

        Scene_Game.emitter.emit(SceneEmitType.graphics_dirty);
    }

    onRemovedFromEntity() {
        super.onRemovedFromEntity();
        this._sprite.node.removeFromParent();
        this._sprite.node.destroy();
    }

    public setSprite(sprite: Sprite) {
        this._sprite = sprite;
        if (this._sprite != null) {
            const uiTransform = this._sprite.getComponent(UITransform);
            if (uiTransform) {
                const originPoint = uiTransform.anchorPoint;
                if (originPoint) {
                    const scale = this.entity ? this.entity.transform.scale : this._sprite.node.scale;
                    const newOrigin = new es.Vector2(originPoint.x * this.getwidth() / scale.x,
                        originPoint.y * this.getheight() / scale.y);
                    this._origin = newOrigin;
                }
            }
        } 
        return this;
    }

    
    update() {
        if (!this._sprite)
            return;

        if (!this._sprite.node.parent)
            return;

        let dirty = false;

        const ui_transform = this._sprite.getComponent(UITransform);
        if (ui_transform) {
            const originNormalized = new Vec2(this.originNormalized.x, this.originNormalized.y)
            if (!ui_transform.anchorPoint.equals(originNormalized)) {
                ui_transform.anchorPoint = originNormalized;
                dirty = true;
            }
        }

        const pos = es.Vector2.add(this.entity.transform.position, this.localOffset);
        const newPos = new Vec3(pos.x, pos.y, 0);
        if (!this._sprite.node.position.equals(newPos)) {
            this._sprite.node.setPosition(newPos.x, newPos.y, 0);
            dirty = true;
        }

        if (this._sprite.node.eulerAngles.z != this.entity.transform.rotation) {
            this._sprite.node.setRotationFromEuler(new Vec3(0, 0, this.entity.transform.rotation));
            dirty = true;
        }
        
        const newScale = new Vec3(this.entity.transform.scale.x, this.entity.transform.scale.y, 1);
        if (!this._sprite.node.scale.equals(newScale)) {
            this._sprite.node.setScale(newScale);
            dirty = true;
        }

        if (dirty) {
            this._areBoundsDirty = true;
            Scene_Game.emitter.emit(SceneEmitType.graphics_dirty);
        }
    }

    public render(batcher: Batcher, camera: component_camera): void {
        
    }
}