import { instantiate, Prefab, resources, Sprite } from "cc";
import { component_camera as component_camera } from "./components/component_camera";
import { component_sprite } from "./components/component_sprite";
import { DefaultRenderer } from "./graphics/DefaultRenderer";
import { IScene } from "./graphics/IScene";
import { RenderableComponentList } from "./graphics/RenderableComponentList";
import { Renderer } from "./graphics/Renderer";

export enum SceneEmitType {
    graphics_dirty
}

export class Scene_Game extends es.Scene implements IScene {
    public static emitter: es.Emitter<SceneEmitType> = new es.Emitter();
    public readonly renderableComponents: RenderableComponentList;
    public camera: component_camera;
    public renderers: Renderer[] = [];

    constructor() {
        super();

        this.renderableComponents = new RenderableComponentList();

        let cameraEntity = this.createEntity("camera");
        this.camera = cameraEntity.addComponent(new component_camera());
    }

    begin() {
        if (this.renderers.length == 0) {
            this.addRenderer(new DefaultRenderer(0, this.camera));
        }
        
        super.begin();
    }

    end() {
        for (let i = 0; i < this.renderers.length; i ++) {
            this.renderers[i].unload();
        }

        super.end();
    }

    onStart() {
        // 创建实体
        const sprite = this.createEntity('sprite');
        resources.load('prefabs/Sprite', Prefab, (err, data) =>{
            const s = instantiate(data)?.getComponent(Sprite);
            if (s) sprite.addComponent(new component_sprite(s));
        });
    }

    update() {
        super.update();

        if (this.renderers.length == 0) {
            return;
        }

        for (let i = 0; i < this.renderers.length; i ++) {
            this.renderers[i].render(this);
        }
    }

    public addRenderer<T extends Renderer>(renderer: T) {
        this.renderers.push(renderer);

        renderer.onAddedToScene(this);

        return renderer;
    }
}