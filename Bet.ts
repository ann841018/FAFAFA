import Server from "../GameSys/Server";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bet extends cc.Component {

    @property(cc.Label) player_money_text: cc.Label = null;
    @property(cc.Label) bet_text: cc.Label = null;
    @property(cc.Label) line_bet_text: cc.Label = null;

    //public static sym_money: Array<number> = [];
    public static line_bet: number = 100;//line_bet

    start() {
        this.player_money_text.string = this.FormatStr(Server.player_money.toString());
        this.bet_text.string = this.FormatStr((Bet.line_bet * Server.line_max).toString());
        this.line_bet_text.string = this.FormatStr(Bet.line_bet .toString());
    }

    Plus() {
        if (Bet.line_bet < 1000) { Bet.line_bet = Bet.line_bet + 100; }
        else { Bet.line_bet = 1000; }
        this.bet_text.string = this.FormatStr((Bet.line_bet * Server.line_max).toString());
        this.line_bet_text.string = this.FormatStr(Bet.line_bet.toString());
    }

    Miner() {
        if (Bet.line_bet > 100) { Bet.line_bet = Bet.line_bet - 100; }
        else { Bet.line_bet = 100; }
        this.bet_text.string = this.FormatStr((Bet.line_bet * Server.line_max).toString());
        this.line_bet_text.string = this.FormatStr(Bet.line_bet.toString());
    }

    Bet() {
        if (Server.player_money >= (Bet.line_bet * Server.line_max)) {
            Server.player_money = Server.player_money - (Bet.line_bet * Server.line_max);
            this.player_money_text.string = this.FormatStr(Server.player_money.toString());
        }
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
