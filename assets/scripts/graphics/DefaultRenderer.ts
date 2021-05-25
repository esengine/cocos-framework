import { Camera, Graphics } from "cc";
import { component_camera } from "../components/component_camera";
import { SceneEmitType, Scene_Game } from "../Scene_Game";
import { IScene } from "./IScene";
import { Renderer } from "./Renderer";

export class DefaultRenderer extends Renderer {
    private _renderDirty: boolean = true;

    constructor(renderOrder: number = 0, camera: component_camera) {
        super(renderOrder, camera);

        Scene_Game.emitter.addObserver(SceneEmitType.graphics_dirty, this.onGraphicsDirty, this);
    }

    private onGraphicsDirty() {
        this._renderDirty = true;
    }

    public render(scene: IScene): void {
        if (!this._renderDirty)
            return;

        this._renderDirty = false;
        let cam = this.camera ?? scene.camera;
        this.beginRender(cam);

        for (let i = 0; i < scene.renderableComponents.count; i ++) {
            let renderable = scene.renderableComponents.get(i);
            if (renderable.enabled && renderable.isVisibleFromCamera(scene.camera))
                this.renderAfterStateCheck(renderable, cam);
        }

        if (this.shouldDebugRender && es.Core.debugRenderEndabled)
            this.debugRender(scene);

        this.endRender();
    }
}