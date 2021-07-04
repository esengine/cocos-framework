import { find, instantiate, Prefab, resources, Sprite, view } from "cc";
import { component_camera } from "../../components/component_camera";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";

@sampleScene("RigidBody")
export class RigidBodyScene extends RenderScene {
    public onStart() {
        // let camera = this.findEntity('camera')?.getComponent(component_camera);
        // if (camera) {
        //     camera.zoom = 2;
        // }
        (this.camera as component_camera).position.add(new es.Vector2(200, 0))

        resources.load('prefabs/moon', Prefab, (err, data)=>{
            this.initAfter(data);
        });
    }

    private initAfter(moonTex: Prefab) {
        let friction = 0.3;
        let elasticity = 0.4;
        this.createBody(new es.Vector2(50, 200), 50, friction, elasticity, new es.Vector2(150, 0), moonTex)
            .addImpulse(new es.Vector2(10, 0));
        this.createBody(new es.Vector2(800, 260), 5, friction, elasticity, new es.Vector2(-180, 0), moonTex);

        this.createBody(new es.Vector2(50, 400), 50, friction, elasticity, new es.Vector2(150, -40), moonTex);
        this.createBody(new es.Vector2(800, 460), 5, friction, elasticity, new es.Vector2(-180, -40), moonTex);

        this.createBody(new es.Vector2(400, 0), 60, friction, elasticity, new es.Vector2(10, 90), moonTex);
        this.createBody(new es.Vector2(500, 400), 4, friction, elasticity, new es.Vector2(0, -270), moonTex);

        this.createBody(new es.Vector2(-200, 250), 0, friction, elasticity, new es.Vector2(0, -270), moonTex);

        this.createBody(new es.Vector2(200, 700), 15, friction, elasticity, new es.Vector2(150, -150), moonTex);
        this.createBody(new es.Vector2(800, 760), 15, friction, elasticity, new es.Vector2(-180, -150), moonTex);
        this.createBody(new es.Vector2(1200, 700), 1, friction, elasticity, new es.Vector2(0, 0), moonTex)
            .addImpulse(new es.Vector2(-5, -20));

        this.createBody(new es.Vector2(100, 100), 1, friction, elasticity, new es.Vector2(100, 90), moonTex)
            .addImpulse(new es.Vector2(40, -10));
        this.createBody(new es.Vector2(100, 700), 100, friction, elasticity, new es.Vector2(200, -270), moonTex);
    }

    private createBody(position: es.Vector2, mass: number, friction: number, elasticity: number, velocity: es.Vector2, texture: Prefab) {
        let rigidBody = new es.ArcadeRigidbody()
            .setMass(mass)
            .setFriction(friction)
            .setElasticity(elasticity)
            .setVelocity(velocity);

        let entity = this.createEntity(es.UUID.randomUUID());
        let sprite = instantiate(texture).getComponent(Sprite)
        if (sprite) entity.addComponent(new SpriteRenderer(sprite));
        entity.setPosition(position.x, position.y);
        entity.addComponent(rigidBody);
        entity.addComponent(new es.CircleCollider());

        return rigidBody;
    }

    update() {
        super.update();

        es.Core.emitter.emit(es.CoreEvents.renderChanged, es.Time.deltaTime);
    }
}