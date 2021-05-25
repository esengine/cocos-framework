import { IRenderable } from "./IRenderable";

export class RenderableComponentList {
    private _components: IRenderable[] = [];
    private _componentsByRenderLayer: Map<number, IRenderable[]> = new Map();

    public get count() {
        return this._components.length;
    }

    public get(index: number) {
        return this._components[index];
    }

    public add(component: IRenderable) {
        this._components.push(component);
        this.addToRenderLayerList(component, component.renderLayer);
    }

    public remove(component: IRenderable) {
        const index = this._components.findIndex(c => c == component);
        if (index != -1) this._components.splice(index, 1);
        const r = this._componentsByRenderLayer.get(component.renderLayer);
        const renderIndex = r?.findIndex(c => c == component);
        if (renderIndex != null && renderIndex != -1) r?.splice(renderIndex, 1);
    }

    public updateRenderableRenderLayer(component: IRenderable, oldRenderLayer: number, newRenderLayer: number) {
        if (this._componentsByRenderLayer.has(oldRenderLayer) &&
            this._componentsByRenderLayer.get(oldRenderLayer)?.find(c => c == component)) {
            const r = this._componentsByRenderLayer.get(oldRenderLayer);
            const index = r?.findIndex(c => c == component);
            if (index != null && index != -1)
                r?.splice(index, 1);
            this.addToRenderLayerList(component, newRenderLayer);
        }
    }

    private addToRenderLayerList(component: IRenderable, renderLayer: number) {
        let list = this.componentsWithRenderLayer(renderLayer);
        es.Insist.isFalse(!!list?.find(c => c == component), "组件renderLayer列表已包含此组件");

        list?.push(component);
    }

    public componentsWithRenderLayer(renderLayer: number) {
        if (!this._componentsByRenderLayer.get(renderLayer)) {
            this._componentsByRenderLayer.set(renderLayer, []);
        }

        return this._componentsByRenderLayer.get(renderLayer);
    }
}