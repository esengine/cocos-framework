import { component_camera } from "../components/component_camera";
import { component_render } from "../components/component_render";
import { Graphics } from "./Graphics";
import { IRenderable } from "./IRenderable";
import { IScene } from "./IScene";

export abstract class Renderer {
    public readonly renderOrder: number = 0;
    public shouldDebugRender: boolean = true;
    public camera: component_camera;

    constructor(renderOrder: number, camera: component_camera) {
        this.renderOrder = renderOrder;
        this.camera = camera;
    }

    public onAddedToScene(scene: es.Scene) { }

    public unload() { }

    protected beginRender(cam: component_camera) {
        Graphics.instance.batcher.begin(cam);
    }

    protected endRender() {
        Graphics.instance.batcher.end();
    }

    public abstract render(scene: IScene): void;

    protected renderAfterStateCheck(renderable: IRenderable, cam: component_camera) {
        renderable.render(Graphics.instance.batcher, cam);
    }

    protected debugRender(scene: IScene) {
        for (let i = 0; i < scene.entities.count; i ++) {
            let entity = scene.entities.buffer[i];
            if (entity.enabled) {
                this.debugRenderComponents(entity);
            }
        }
    }

    private debugRenderComponents(entity: es.Entity) {
        for (let i = 0; i < entity.components.count; i ++) {
            let component = entity.components.buffer[i];
            if (component.enabled && component instanceof component_render)
                component.debugRender(Graphics.instance.batcher);
        }
    }
}