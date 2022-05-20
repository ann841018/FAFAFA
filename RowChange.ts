import BtnCtrl from "./BtnControl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node) spin_node_5: cc.Node = null;
    @property(cc.Node) spin_node_15: cc.Node = null;
    @property(cc.Node) main_node_5: cc.Node = null;
    @property(cc.Node) main_node_15: cc.Node = null;

    //start () {}

    Switch_To_5()
    {
        this.spin_node_5.active = true;
        this.spin_node_15.active = false;
        this.main_node_5.active = true;
        this.main_node_15.active = false;
        BtnCtrl.row_max = 5;
    }

    Switch_To_15() {
        this.spin_node_15.active = true;
        this.spin_node_5.active = false;
        this.main_node_15.active = true;
        this.main_node_5.active = false;
        BtnCtrl.row_max = 15;
    }
    // update (dt) {}
}
