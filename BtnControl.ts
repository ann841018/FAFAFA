import Server from "../GameSys/Server";
import State from "../GameSys/GameState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BtnCtrl extends cc.Component {

    @property(cc.Node) spin_btn: cc.Node = null;
    @property(cc.Node) stop_btn: cc.Node = null;
    @property(cc.Node) free_btn: cc.Node = null;
    @property(cc.Node) plus_btn: cc.Node = null;
    @property(cc.Node) miner_btn: cc.Node = null;
    @property(cc.Node) bonus_node: cc.Node = null;
    @property(cc.Label) stage_text: cc.Label = null;
    @property(cc.Label) state_text: cc.Label = null;

    public static row_max: number = 5;
    public static auto_num: number = 0;

    public static isStop: boolean = false;
    public static isTurbo: boolean = false;

    canTurbo: boolean = false;

    //start() { }
    Spin() { State.state_id = "PushSpin"; }

    Stop() { BtnCtrl.isStop = true; }

    Turbo() {
        if (BtnCtrl.isTurbo == false) { BtnCtrl.isTurbo = true; }
        else { BtnCtrl.isTurbo = false; }
    }

    PushSpin() {
        if (BtnCtrl.isTurbo == false) this.stop_btn.active = true;
        this.plus_btn.getComponent(cc.Button).interactable = false;
        this.miner_btn.getComponent(cc.Button).interactable = false; this.bonus_node.active = false;
        if (State.stage_id != "Doing") {
            if (BtnCtrl.auto_num > 0) this.state_text.string = "AUTO";
            else this.state_text.string = "PUSH SPIN";
            this.stage_text.string = "";
        }
    }

    isSpin() {
        if (BtnCtrl.isStop == true) { this.stop_btn.getComponent(cc.Button).interactable = false; }
    }

    isStage() {
        if (Server.stage == 1) { this.free_btn.active = true; this.state_text.string = "FREE SPIN";  }
        else if (Server.stage == 2) { this.bonus_node.active = true; this.state_text.string = "BONUS GAME"; this.stage_text.string = ""; }
    }

    Reset() {
        this.canTurbo = true; BtnCtrl.isStop = false; 
        this.stop_btn.getComponent(cc.Button).interactable = true;
        this.plus_btn.getComponent(cc.Button).interactable = true;
        this.miner_btn.getComponent(cc.Button).interactable = true;
        if (State.stage_id != "Doing") { this.spin_btn.getComponent(cc.Button).interactable = true; this.free_btn.active = false; }
        else { this.free_btn.getComponent(cc.Button).interactable = true; }
    }

    CantPushSpin() {
        if (Server.stage == 2) { this.stage_text.string = "BONUS\nGAME"; }
        else if (Server.stage == 1) {
            if (State.stage_id == "Start") this.stage_text.string = "FREE\nSPIN";
            else this.stage_text.string = "";
        }
        this.stop_btn.active = false; 
        if (State.stage_id != "Doing") this.spin_btn.getComponent(cc.Button).interactable = false;
        else this.free_btn.getComponent(cc.Button).interactable = false;
    }
}
