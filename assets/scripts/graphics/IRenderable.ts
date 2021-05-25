import { component_camera } from "../components/component_camera";
import { Batcher } from "./Batcher";

export interface IRenderable {
    enabled: boolean;
    renderLayer: number;
    isVisibleFromCamera(camera: component_camera): boolean;
    render(batcher: Batcher, camera: component_camera): void;
    debugRender(batcher: Batcher): void;
}