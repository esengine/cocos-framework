export class ColliderTrigger extends es.Component implements es.ITriggerListener {
    onTriggerEnter(other: es.Collider, local: es.Collider) {
        console.log("onTriggerEnter", other, local);
    }

    onTriggerExit(other: es.Collider, local: es.Collider) {
        console.log("onTriggerExit", other, local);
    }
}