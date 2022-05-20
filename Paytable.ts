const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) paytable_node: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    Open(){ this.paytable_node.active = true; }

    Close() { this.paytable_node.active = false; }
    // update (dt) {}
}
