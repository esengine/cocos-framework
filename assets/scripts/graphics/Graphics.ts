import { Batcher } from "./Batcher";

export class Graphics {
    public static instance: Graphics;
    public batcher: Batcher;

    constructor() {
        this.batcher = new Batcher();
    }
}