import { Camera, Material, Rect } from "cc";
import { Batcher } from "../graphics/Batcher";

export interface IRenderable {
    bounds: es.Rectangle;
    enabled: boolean;
    layerDepth: number;
    renderLayer: number;
    material: Material;
    isVisible: boolean;
    getMaterial<T extends Material>(): T;
    isVisibleFromCamera(camera: Camera): boolean;
    render(batch: Batcher, camera: Camera): void;
    debugRender(batch: Batcher): void;
}