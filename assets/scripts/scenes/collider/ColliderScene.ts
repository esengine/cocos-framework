import { instantiate, Prefab, resources, Sprite } from "cc";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";
import { ColliderTrigger } from "./ColliderTrigger";

@sampleScene("collider")
export class ColliderScene extends RenderScene {
    public initialize() {
        let box1 = this.createEntity("box1");
        resources.load('prefabs/moon', Prefab, (err, data)=>{
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                box1.addComponent(new ColliderTrigger());
                box1.addComponent(new es.Mover());
                box1.addComponent(new SpriteRenderer(moonTex))
                if (moonTex.spriteFrame) 
                    box1.addComponent(new es.BoxCollider()).isTrigger = true;
            }
            box1.setPosition(200, 100);
        });

        let box2 = this.createEntity("box2");
        resources.load('prefabs/moon', Prefab, (err, data)=>{
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) {
                box2.addComponent(new ColliderTrigger());
                box2.addComponent(new SpriteRenderer(moonTex))
                if (moonTex.spriteFrame) 
                    box2.addComponent(new es.BoxCollider());
            }
            box2.setPosition(100, 200);
        });

        es.Core.schedule(0, true, this, ()=> {
            const collisionResult = new es.CollisionResult();
            box1.getComponent(es.Mover)?.move(es.Vector2.up, collisionResult);
        });
    }
}