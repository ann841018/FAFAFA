import Server from "../GameSys/Server";
import State from "../GameSys/GameState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Money extends cc.Component {

    @property(cc.Label) player_money_text: cc.Label = null;
    @property(cc.Label) won_text: cc.Label = null;
    @property(cc.Label) prize_text: cc.Label = null;

    tem_money: number = 0;
    isShowMoney: boolean = false;    

    start() { this.won_text.string = "0"; }

    SetMoney() {
        if (Server.stage != 2) {
            if (this.isShowMoney == false) {
                this.Win_Money();
                this.isShowMoney = true;
            }
        }// if (大獎)
        if (this.tem_money < Server.prize_win) {
            for (let i = Server.prize_win.toString().length - 2; i >= 0; i--) {
                if (i == Server.prize_win.toString().length - 2) if (Server.prize_win % Math.pow(10, i) == 0) this.tem_money = this.tem_money + Math.pow(10, i);
                else if ((Server.prize_win - this.tem_money) % Math.pow(10, i) == 0) this.tem_money = this.tem_money + Math.pow(10, i);
            } this.Prize_Money();
            if (Server.stage == 2) {
                if (this.isShowMoney == false) {
                    this.Win_Money();
                    this.isShowMoney = true;
                }
            }
        } else {
            if (this.isShowMoney == true) {
                if (Server.stage == 0) State.state_id = "Idle";
                else { State.state_id = "Stage"; State.stage_id = "End"; }
            }
        }
    }

    Win_Money() {
        this.won_text.string = this.FormatStr(Server.total_win.toString());
        Server.player_money = Server.player_money + Server.total_win;
        this.player_money_text.string = this.FormatStr(Server.player_money.toString());
    }

    Prize_Money() {
        this.won_text.string = this.FormatStr(Server.prize_win.toString());
        this.prize_text.string = this.FormatStr(this.tem_money.toString())
        this.player_money_text.string = this.FormatStr(Server.player_money.toString());
    }

    ReSet() {
        this.isShowMoney = false;
        this.tem_money = 0;
        if (State.stage_id != "Doing") this.won_text.string = "0";
        this.prize_text.string = "0";
    }

    FormatStr(oriStr: string) {//千元進位
        let i = oriStr.length;
        var str = []; var totalStr = "";
        if (i > 3) {
            for (let j = 0; j < i / 3; j++) {
                if (i % 3 == 0) str[j] = oriStr.substr(j * 3, 3);
                else {
                    str[j] = oriStr.substr((j - 1) * 3 + i % 3, 3);
                    str[0] = oriStr.substr(0, i % 3);
                } totalStr = totalStr + str[j] + ",";
            } return totalStr.substr(0, totalStr.length - 1);
        } else return oriStr;
    }
}
