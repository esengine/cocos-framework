
import { _decorator, Component, Node } from 'cc';
import { MainScene } from './scenes/MainScene';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start () {
        es.Core.create(false);
        es.Core.debugRenderEndabled = false;

        es.Core.scene = new MainScene();
    }

    update (deltaTime: number) {
        es.Core.emitter.emit(es.CoreEvents.frameUpdated);
    }
}
