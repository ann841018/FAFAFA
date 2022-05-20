import Server from "../GameSys/Server";
import State from "../GameSys/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Bouns extends cc.Component {

    @property(cc.Node) BG: cc.Node = null;
    @property(cc.Node) anim_node: cc.Node = null;
    @property(cc.Node) prize_node: cc.Node = null;
    @property(cc.Label) Condown_text: cc.Label = null;

    @property(cc.AudioSource) SE_door: cc.AudioSource = null;
    @property(cc.AudioSource) SE_countdown: cc.AudioSource = null;
    @property(cc.AudioSource) BGM_bonusgame: cc.AudioSource = null;
    @property(cc.AudioSource) BGM_prize: cc.AudioSource = null;

    public static chose_time: number = 3; //總共多少個選擇
    ischose: number = 0; //計算抽中次數(抽到中用)

    chose_time_O: number = 0; //計算選擇次數(每個都中)
    chose_time_M: number = 0; //計算選擇次數(抽到中)
    time: number = 0; //計時
    condown: number = 30; //倒數

    onEnable() {
        this.condown = 30; 
        this.Condown_text.string = this.condown.toString();
        this.BG.active = true; this.BGM_bonusgame.play();
        this.chose_time_O = 0; this.chose_time_M = 0; this.ischose = 0;      
    }

    /**每個都中獎，中幾個*/
    COne(event, btn_name) {
        if (Bouns.chose_time == 1) {
            let text_num: number = 0;
            for (let i = 0; i < Server.bonus_num.length; i++) {
                let btn = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                let text = btn.node.getChildByName("Label").getComponent(cc.Label);
                if (btn_name == i) {
                    text.string = Server.bonus_num[0].toString();
                } else {
                    text_num += 1;
                    text.string = Server.bonus_num[text_num].toString();
                    text.node.color = cc.Color.GRAY;
                }
                btn.interactable = false;
            }
        }
        else {
            let btn = this.BG.getChildByName(btn_name).getComponent(cc.Button);
            let text = btn.node.getChildByName("Label").getComponent(cc.Label);
            text.string = Server.bonus_num[this.chose_time_O].toString();
            btn.interactable = false;
            this.chose_time_O += 1;
            if (this.chose_time_O == Bouns.chose_time) {
                for (let i = 0; i < Server.bonus_num.length; i++) {
                    let btn_all = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                    btn_all.interactable = false;
                }
                setTimeout(() => {
                    for (let i = 0; i < Server.bonus_num.length; i++) {
                        let btn_all = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                        let text_all = btn_all.node.getChildByName("Label").getComponent(cc.Label);
                        if (text_all.string == "") {
                            text_all.node.color = cc.Color.GRAY;
                            text_all.string = Server.bonus_num[this.chose_time_O].toString();
                            btn_all.interactable = false;
                            this.chose_time_O += 1;
                        }
                    }
                    State.stage_id = "Prize";
                    this.time = 0;
                }, 500);
            }
        }
    }

    /**抽到中為止*/
    CMore(event, btn_name) {
        let ran: number;
        if (Server.bonus_num.length == 1) {
            ran = Math.floor(Math.random() * 10);
            let btn = this.BG.getChildByName(btn_name).getComponent(cc.Button);
            btn.interactable = false;
            if (this.chose_time_M == Server.bonus_num.length - 1) ran = 10;
            if (ran > 4) { this.COne(event, btn_name); }
            this.chose_time_M += 1;
        }
        else {
            if (this.ischose <= Server.bonus_num.length) ran = Math.floor(Math.random() * 10);//亂數決定是否要中
            if (this.chose_time_M >= Server.bonus_num.length - Server.bonus_num.length) { ran = 10; }//如果前面按下的都沒中，剩下都要中
            if (ran > 4) {
                this.ischose += 1;
                this.COne(event, btn_name);
            }
            else {//關閉按鈕
                let btn = this.BG.getChildByName(btn_name).getComponent(cc.Button);
                btn.interactable = false;
            }
            this.chose_time_M += 1;
        }
    }

    TimeUp() {
        if (this.chose_time_O < 1 && this.chose_time_M < 1) {
            let left = 0;
            for (let i = 0; i < Server.bonus_num.length; i++) {
                let btn = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                let text = btn.node.getChildByName("Label").getComponent(cc.Label);
                left += 1;
                text.string = Server.bonus_num[i].toString();
                if (left > Bouns.chose_time) text.node.color = cc.Color.GRAY;
                btn.interactable = false;
            }
        }
        else {
            if (this.chose_time_O > 0 || this.chose_time_M > 0) {
                let left: number = 0;
                if (this.chose_time_O == 0) { left = this.ischose; }
                else { left = this.chose_time_O; }
                for (let i = 0; i < Server.bonus_num.length; i++) {
                    let btn = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                    if (btn.interactable == true) {
                        let text = btn.node.getChildByName("Label").getComponent(cc.Label);
                        text.string = Server.bonus_num[left].toString();
                        left += 1;
                        if (left > Bouns.chose_time) { text.node.color = cc.Color.GRAY; }
                        btn.interactable = false;
                    }
                }
            }
        }
    }

    Enter() {
        this.time = this.time + 1;
        if (this.time == 30) {
            this.anim_node.active = true; this.SE_door.play();
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                this.BG.active = true; State.stage_id = "Doing";
                this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "open", false);
                this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "open", false);
                this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                    this.anim_node.active = false;  this.time = 0;
                });
            });
        }
    }

    BonusGame() {
        this.time = this.time + 1;
        if (this.condown == 0) {
            this.TimeUp();
            this.time = 0;
            State.stage_id = "Prize";
        }
        if (this.time == 60) {
            this.condown -= 1;
            this.SE_countdown.play();
            this.Condown_text.string = this.condown.toString();
            this.time = 0;
        }
    }

    Prize() {
        this.time = this.time + 1;
        if (this.time == 30) {
            this.prize_node.active = true; this.BGM_prize.play(); 
            this.prize_node.getChildByName("Win").getComponent(sp.Skeleton).setAnimation(0, "YouWin", false);            
        } if (this.time == 32) { State.state_id = "Win"; }
    }

    End() {
        this.time = this.time + 1;
        if (this.time == 180) {
            this.anim_node.active = true; this.prize_node.active = false; this.SE_door.play();
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "close", false);
        } this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
            Server.stage = 0; State.state_id = "Idle"; this.BG.active = false;
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "open", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "open", false);
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                for (let i = 0; i < Server.bonus_num.length; i++) {
                    let btn = this.BG.getChildByName(i.toString()).getComponent(cc.Button);
                    let text = btn.node.getChildByName("Label").getComponent(cc.Label);
                    text.node.color = cc.Color.WHITE; text.string = ""; btn.interactable = true;
                } this.anim_node.active = false; this.time = 0;
            });
        });
    }
}
