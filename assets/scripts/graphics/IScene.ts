import { component_camera } from "../components/component_camera";
import { RenderableComponentList } from "./RenderableComponentList";

export interface IScene {
    camera: component_camera;
    readonly entities: es.EntityList;
    readonly renderableComponents: RenderableComponentList;
}