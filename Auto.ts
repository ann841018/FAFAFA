import BtnCtrl from "../UI/BtnControl";
import State from "../GameSys/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Auto extends cc.Component {

    @property(cc.Node) auto_node: cc.Node = null;
    @property(cc.Label) auto_text: cc.Label = null;

    
    time: number = 0;
    AutoClose() { this.auto_node.active = false; }

    AutoShow() {
        if (BtnCtrl.auto_num == 0) this.auto_node.active = true;
        else BtnCtrl.auto_num = 0;
    }

    AutoTime(event, time) {//自動轉次數按鈕押下去後執行
        BtnCtrl.auto_num = time;
        this.auto_text.string = BtnCtrl.auto_num.toString();
        if (State.state_id == "CanPush") { this.DoAuto(); }
    }

    DoAuto() { // 執行自動轉
        State.state_id = "PushSpin"; this.time = 0; BtnCtrl.auto_num -= 1; 
        if (BtnCtrl.auto_num != 0) this.auto_text.string = BtnCtrl.auto_num.toString();
        else this.auto_text.string = "SPIN";
    }

    IfAuto() {
        if (BtnCtrl.auto_num != 0) {
            //if (BtnCtrl.auto_num == -1) BtnCtrl.auto_num = 0;
            this.time = this.time + 1;
            if (this.time == 60) { this.DoAuto(); }
        }
    }
}