import Server from "../GameSys/Server";
import State from "../GameSys/GameState";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FreeSpin extends cc.Component {

    @property(cc.Node) FG_BG: cc.Node = null;
    @property(cc.Node) anim_node: cc.Node = null;
    @property(cc.Node) prize_node: cc.Node = null;

    @property(cc.AudioSource) SE_door: cc.AudioSource = null;
    @property(cc.AudioSource) BGM_freespin: cc.AudioSource = null;
    @property(cc.AudioSource) BGM_prize: cc.AudioSource = null;
    
    time: number = 0;

    onEnable() {
        this.BGM_freespin.play();
        let FG_Text = this.node.getChildByName("FG_Text");
        FG_Text.getComponent(cc.Label).string = Server.bonus_num[0].toString();
        this.DoFreeSpin(); 
    }

    Enter() {
        this.time = this.time + 1;
        if (this.time == 30) {
            this.anim_node.active = true; this.SE_door.play();
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                this.FG_BG.active = true; this.node.active = true; State.stage_id = "Doing"; //State.state_id = "idle";
                this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "open", false);
                this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "open", false);
                this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                    this.anim_node.active = false; this.time = 0;
                });
            });
        }
    }

    DoFreeSpin() { //°õ¦æspin
        let FG_Text = this.node.getChildByName("FG_Text");
        if (Server.bonus_num[0] > 0) { FG_Text.getComponent(cc.Label).string = (5 - Server.bonus_num[0]).toString() + " / 5"; }
        else if (Server.bonus_num[0] == 0) { FG_Text.getComponent(cc.Label).string = "5 / 5"; State.stage_id = "Prize"; Server.stage = 1; State.state_id = "Stage";   }
        Server.bonus_num[0] -= 1;
    }

    Prize() {
        this.time = this.time + 1; 
        if (this.time == 10) {
            this.prize_node.active = true; this.BGM_prize.play();
            this.prize_node.getChildByName("Win").getComponent(sp.Skeleton).setAnimation(0, "YouWin", false);          
        } if (this.time == 12) { State.state_id = "Win";  }
    }

    End() {
        this.time = this.time + 1;
        if (this.time == 90) {
            this.anim_node.active = true; this.prize_node.active = false; this.SE_door.play();
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "close", false);
            var FG_Text = this.node.getChildByName("FG_Text"); 
            FG_Text.getComponent(cc.Animation).play("FS_Back");
        }this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
            Server.stage = 0; State.state_id = "Idle"; this.node.active = false; this.FG_BG.active = false; 
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setAnimation(0, "open", false);
            this.anim_node.getChildByName("Door_R").getComponent(sp.Skeleton).setAnimation(0, "open", false);
            this.anim_node.getChildByName("Door_L").getComponent(sp.Skeleton).setEndListener(() => {
                this.anim_node.active = false; this.time = 0;
            });
        });
    }
} 
