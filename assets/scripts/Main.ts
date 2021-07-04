
import { _decorator, Component, Node, Button, find, instantiate, Label, Prefab, resources, Toggle, ToggleComponent } from 'cc';
import { PolygonSprite } from './components/PolygonSprite';
import { Batcher } from './graphics/Batcher';
import { Input } from './Input/Input';
import { KeyboardUtils } from './Input/KeyboardUtils';
import { BasicScene } from './scenes/BasicScene';
import { RenderScene, sampleList, SceneEmitType } from './scenes/RenderScene';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start () {
        es.Core.debugRenderEndabled = true;
        es.Core.create(true);
        
        es.Graphics.instance = new es.Graphics(new Batcher());
        KeyboardUtils.init();
        Input.initialize();

        es.Core.scene = new BasicScene();

        this.setupSceneSelector();
    }

    setupSceneSelector() {
        const checkBox = find("Canvas_UI/Layout/DebugRender")?.getComponent(Toggle);
        if (checkBox) {
            checkBox.isChecked = es.Core.debugRenderEndabled;
            checkBox.node.on('toggle', (toggle: ToggleComponent) => {
                es.Core.debugRenderEndabled = toggle.isChecked;
            }, this);
        }

        const layout = find("Canvas_UI/Layout");
        sampleList.forEach((value, key)=>{
            resources.load('prefabs/Button', Prefab, (err, data)=>{
                const buttonNode = instantiate(data);
                layout?.addChild(buttonNode);

                const label = buttonNode.getChildByName("Label")?.getComponent(Label);
                if (label) label.string = key;
                buttonNode.on(Button.EventType.CLICK, ()=>{
                    es.Core.scene = new value();
                }, this);
            });
        });

    }

    update (deltaTime: number) {
        es.Core.emitter.emit(es.CoreEvents.frameUpdated, deltaTime);

        Input.update();
    }
}
