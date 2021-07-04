import { instantiate, Prefab, resources, Sprite } from "cc";
import { PolygonMesh } from "../../components/PolygonMesh";
import { PolygonSprite } from "../../components/PolygonSprite";
import { SpriteRenderer } from "../../components/SpriteRenderer";
import { RenderScene, sampleScene } from "../RenderScene";
import { VerletSystem } from "./VerletSystem";

@sampleScene("Verlet Physics")
export class VerletPhysicsScene extends RenderScene {
    initialize() {
        const verletSystem = this.createEntity("verlet-system")
            .addComponent(new VerletSystem());

        this.createPolygons();

        this.createRope(verletSystem.world);

        verletSystem.world.addComposite(new es.Tire(new es.Vector2(175, 32), 64, 32, 0.3, 0.5));
        verletSystem.world.addComposite(new es.Tire(new es.Vector2(300, 16), 50, 4, 0.2, 0.7));
        verletSystem.world.addComposite(new es.Tire(new es.Vector2(450, 64), 64, 7, 0.1, 0.3));

        verletSystem.world.addComposite(new es.Cloth(new es.Vector2(200, 200), 200, 200, 20, 0.25, 50));

        verletSystem.world.addComposite(new es.Ragdoll(200, 20, es.RandomUtils.randint(140, 240)));
        verletSystem.world.addComposite(new es.Ragdoll(250, 20, es.RandomUtils.randint(140, 240)));
        verletSystem.world.addComposite(new es.Ragdoll(300, 20, es.RandomUtils.randint(140, 240)));

        verletSystem.world.addComposite(new es.Ball(new es.Vector2(100, 60), es.RandomUtils.randint(10, 50)));
        verletSystem.world.addComposite(new es.Ball(new es.Vector2(150, 60), es.RandomUtils.randint(10, 50)));
        verletSystem.world.addComposite(new es.Ball(new es.Vector2(200, 60), es.RandomUtils.randint(10, 50)));
    }

    createPolygons() {
        // const trianglePoints: es.Vector2[] = [new es.Vector2(0, 0), new es.Vector2(128, 0), new es.Vector2(128, 128)];
        // const triangleEntity = this.createEntity("triangle");

        // resources.load('prefabs/moon_polygon', Prefab, (err, data) => {
        //     let moonTex = instantiate(data).getComponent(PolygonSprite)!;
        //     triangleEntity.setPosition(50, 150);
        //     triangleEntity.addComponent(new PolygonMesh(trianglePoints, false)).setColor(es.Color.Green).setTexture(moonTex);
        //     triangleEntity.addComponent(new es.PolygonCollider(trianglePoints));
        // });

        const circleEntity = this.createEntity("circle");
        resources.load('prefabs/moon', Prefab, (err, data) => {
            let moonTex = instantiate(data).getComponent(Sprite);
            if (moonTex) circleEntity.addComponent(new SpriteRenderer(moonTex));
            circleEntity.setPosition(250, 60);
            circleEntity.addComponent(new es.CircleCollider(64));
        });


        // const polyPoints = es.Polygon.buildSymmetricalPolygon(5, 140);
        // const polygonEntity = this.createEntity("boxCollider");
        // resources.load('prefabs/moon_polygon', Prefab, (err, data) => {
        //     let moonTex = instantiate(data).getComponent(PolygonSprite)!;
        //     polygonEntity.setPosition(230, 225);
        //     polygonEntity.addComponent(new PolygonMesh(polyPoints)).setColor(es.Color.Green).setTexture(moonTex);
        //     polygonEntity.addComponent(new es.PolygonCollider(polyPoints));
        // });

        // polygonEntity.tweenRotationDegreesTo(180, 3)
        //     .setLoops(es.LoopType.pingpong, 50)
        //     .setEaseType(es.EaseType.linear)
        //     .start();
    }

    createRope(world: es.VerletWorld) {
        const linePoints = [];
        for (var i = 0; i < 10; i++)
            linePoints[i] = new es.Vector2(30 * i + 50, 10);

        const line = new es.LineSegments(linePoints, 0.3)
            .pinParticleAtIndex(0);
        world.addComposite(line);
    }

    update() {
        super.update();

        es.Core.emitter.emit(es.CoreEvents.renderChanged, es.Time.deltaTime);
    }
}