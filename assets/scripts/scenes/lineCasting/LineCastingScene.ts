import { resources, Prefab, instantiate, Sprite, BoxCollider } from "cc";
import { component_sprite } from "../../components/component_sprite";
import { RenderScene, sampleScene } from "../RenderScene";
import { LineCaster } from "./LineCaster";

@sampleScene("lineCasting")
export class LineCastingScene extends RenderScene {
    public initialize() {
        let playerEntity = this.createEntity("player");
        resources.load('prefabs/moon', Prefab, (err, data)=>{
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                playerEntity.addComponent(new component_sprite(moonTex))
                if (moonTex.spriteFrame) 
                    playerEntity.addComponent(new es.BoxCollider());
            }
        });
        playerEntity.setPosition(200, 100);


        let lineCaster = this.createEntity("linecaster")
            .addComponent(new LineCaster());
        lineCaster.transform.position = new es.Vector2(300, 100);
    }
}