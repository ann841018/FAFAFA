const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) panel_node: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    Open() { this.panel_node.active = true; }

    Close() { this.panel_node.active = false; }
    // update (dt) {}
}
