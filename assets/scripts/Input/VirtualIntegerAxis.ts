import { Keys } from "./Keys";
import { KeyboardKeys } from "./VirtualAxis";
import { OverlapBehavior, VirtualInput, VirtualInputNode } from "./VirtualInput";

export class VirtualIntegerAxis extends VirtualInput {
    public nodes: VirtualAxisNode[] = [];

    public get value(){
        for (let i = 0; i < this.nodes.length; i ++){
            let val = this.nodes[i].value;
            if (val != 0)
                return Math.sign(val);
        }

        return 0;
    }

    constructor(...nodes: VirtualAxisNode[]){
        super();
        this.nodes.concat(nodes);
    }

    public update() {
        for (let i = 0; i < this.nodes.length; i ++)
            this.nodes[i].update();
    }

    /**
     * 添加键盘键来模拟这个虚拟输入的左/右或上/下
     * @param overlapBehavior
     * @param negative
     * @param positive
     */
    public addKeyboardKeys(overlapBehavior: OverlapBehavior, negative: Keys, positive: Keys){
        this.nodes.push(new KeyboardKeys(overlapBehavior, negative, positive));
        return this;
    }
}

export abstract class VirtualAxisNode extends VirtualInputNode {
    public abstract value: number;
}