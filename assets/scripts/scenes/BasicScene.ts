import { instantiate, Prefab, resources, Sprite } from "cc";
import { component_sprite } from "../components/component_sprite";
import { RenderScene, sampleScene } from "./RenderScene";

@sampleScene("基础场景")
export class BasicScene extends RenderScene {
    public initialize() {
        resources.load('prefabs/moon', Prefab, (err, data)=>{
            let moonTex = instantiate(data).getComponent(Sprite);
            let playerEntity = this.createEntity("player");
            if (moonTex) playerEntity.addComponent(new component_sprite(moonTex))
        });
    }
}