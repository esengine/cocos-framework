
import { _decorator, Component, Node } from 'cc';
import { Graphics } from './graphics/Graphics';
import { Input } from './Input/Input';
import { KeyboardUtils } from './Input/KeyboardUtils';
import { Scene_Game } from './Scene_Game';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start () {
        es.Core.debugRenderEndabled = true;
        es.Core.create(true);
        
        Graphics.instance = new Graphics();
        KeyboardUtils.init();
        Input.initialize();

        es.Core.scene = new Scene_Game();
    }

    update (deltaTime: number) {
        es.Core.emitter.emit(es.CoreEvents.frameUpdated, deltaTime);

        Input.update();
    }
}
