import { EventKeyboard, SystemEvent, systemEvent } from "cc";
import { Keys } from "./Keys";

export class KeyboardUtils {
    /**
     * 当前帧按键状态
     */
    public static currentKeys: Keys[] = [];
    /**
     * 上一帧按键状态
     */
    public static previousKeys: Keys[] = [];
    private static keyStatusKeys: Keys[] = [];

    public static init(): void {
        systemEvent.on(SystemEvent.EventType.KEY_UP, KeyboardUtils.onKeyUpHandler, this);
        systemEvent.on(SystemEvent.EventType.KEY_DOWN, KeyboardUtils.onKeyDownHandler, this);
    }

    public static update(){
        KeyboardUtils.previousKeys.length = 0;
        for (let key of KeyboardUtils.currentKeys){
            KeyboardUtils.previousKeys.push(key);
            new es.List(KeyboardUtils.currentKeys).remove(key);
        }
        KeyboardUtils.currentKeys.length = 0;
        for (let key of KeyboardUtils.keyStatusKeys){
            KeyboardUtils.currentKeys.push(key);
        }
    }

    public static destroy(): void {
        KeyboardUtils.currentKeys.length = 0;

        systemEvent.off(SystemEvent.EventType.KEY_UP, KeyboardUtils.onKeyUpHandler, this);
        systemEvent.off(SystemEvent.EventType.KEY_DOWN, KeyboardUtils.onKeyDownHandler, this);
    }

    private static onKeyDownHandler(event: EventKeyboard): void {
        if (!new es.List(KeyboardUtils.keyStatusKeys).contains(event.keyCode))
            KeyboardUtils.keyStatusKeys.push(event.keyCode);
    }

    private static onKeyUpHandler(event: EventKeyboard): void {
        let linqList = new es.List(KeyboardUtils.keyStatusKeys);
        if (linqList.contains(event.keyCode))
            linqList.remove(event.keyCode);
    }
}