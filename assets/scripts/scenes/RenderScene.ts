import { Button, EventHandler, find, instantiate, Label, Prefab, resources, Sprite, Toggle, ToggleComponent } from "cc";
import { component_camera as component_camera } from "../components/component_camera";
import { SpriteRenderer } from "../components/SpriteRenderer";

export enum SceneEmitType {
    graphics_dirty
}

export var sampleList: Map<string ,new () => RenderScene> = new Map();

export function sampleScene(buttonName: string) {
    return function(target: any) {
        sampleList.set(buttonName, target);
    }
}

export abstract class RenderScene extends es.Scene {
    constructor() {
        super();

        let cameraEntity = this.createEntity("camera");
        this.camera = cameraEntity.addComponent(new component_camera());
    }
}