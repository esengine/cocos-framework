import { RenderScene, sampleScene } from "../RenderScene";
import { VerletSystem } from "./VerletSystem";

@sampleScene("Verlet Physics")
export class VerletPhysicsScene extends RenderScene {
    initialize() {
        const verletSystem = this.createEntity("verlet-system")
            .addComponent(new VerletSystem());

        this.createPolygons();

        this.createRope(verletSystem.world);

        verletSystem.world.addComposite(new es.Ball(new es.Vector2(100, 60), es.RandomUtils.randint(10,50)));
        verletSystem.world.addComposite(new es.Ball(new es.Vector2(150, 60), es.RandomUtils.randint(10,50)));
        verletSystem.world.addComposite(new es.Ball(new es.Vector2(200, 60), es.RandomUtils.randint(10,50)));
    }

    createPolygons() {
        const trianglePoints: es.Vector2[] = [new es.Vector2(0, 0), new es.Vector2(-100, -100), new es.Vector2(-100, -150)];
        const triangleEntity = this.createEntity("triangle");
			triangleEntity.setPosition(100, 300);
			// triangleEntity.addComponent(new es.PolygonMesh(trianglePoints, false).SetColor(Color.LightGreen));
			triangleEntity.addComponent(new es.PolygonCollider(trianglePoints));


			var circleEntity = this.createEntity("circle");
			circleEntity.setPosition(1000, 250);
			// circleEntity.addComponent(new SpriteRenderer(Content.Load<Texture2D>(Nez.Content.Shared.Moon)))
			// 	.SetColor(Color.LightGreen);
			circleEntity.addComponent(new es.CircleCollider(64));


			var polyPoints = es.Polygon.buildSymmetricalPolygon(5, 140);
			var polygonEntity = this.createEntity("boxCollider");
			polygonEntity.setPosition(460, 450);
			// polygonEntity.AddComponent(new PolygonMesh(polyPoints)).SetColor(Color.LightGreen);
			polygonEntity.addComponent(new es.PolygonCollider(polyPoints));

			// polygonEntity.TweenRotationDegreesTo(180, 3f)
			// 	.SetLoops(Tweens.LoopType.PingPong, 50)
			// 	.SetEaseType(Tweens.EaseType.Linear)
			// 	.Start();
    }

    createRope(world: es.VerletWorld) {
        var linePoints = [];
        for (var i = 0; i < 10; i++)
            linePoints[i] = new es.Vector2(30 * i + 50, 10);

        var line = new es.LineSegments(linePoints, 0.3)
            .pinParticleAtIndex(0);
        world.addComposite(line);
    }

    update() {
        super.update();

        es.Core.emitter.emit(es.CoreEvents.renderChanged, es.Time.deltaTime);
    }
}