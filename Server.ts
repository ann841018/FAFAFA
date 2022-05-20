import Bet from "../UI/Bet";
import State from "../GameSys/GameState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Server extends cc.Component {

    public static player_money: number = 0;//玩家現金
    public static bet_money: number = 9;//下注金額

    public static sym_num: Array<number> = [];//圖騰15格 0-11
    public static sym_money: Array<number> = [];//圖騰錢
    public static bonus_num: Array<number> = []; //bonus拿到數字
    public static line_num: Array<number> = [];//中獎線 0-17
    public static line_max: number = 9;//幾線
    public static line_count: number = 0;//幾條線
    public static line_symbol: Array<number> = [];//連線的是哪個圖騰
    public static line_symbol_max: Array<number> = [];//單線中獎圖騰數3,4,5
    public static line_win: Array<number> = [];//線贏
    public static total_win: number = 0;//總贏
    public static prize_win: number = 0;//總贏
    public static stage: number = 0;

    spin_index: number = 0;
    // LIFE-CYCLE CALLBACKS:

    start() {
        Server.player_money = 1000000;
        Server.sym_num = [4, 7, 2, 5, 10, 6, 1, 4, 3, 1, 0, 8, 9, 2, 3];
    }

    Spin_Result() {
        Server.line_win = []; Server.total_win = 0; if (State.stage_id != "Doing") Server.prize_win = 0;
        this.Fake_Result(this.spin_index);
        for (let i = 0; i < Server.line_count; i++) {
            Server.line_win[i] = this.SetSymMoney(Server.line_symbol[i], Server.line_symbol_max[i] - 3) * Bet.line_bet;
            Server.total_win = Server.total_win + Server.line_win[i];
            Server.prize_win = Server.prize_win + Server.line_win[i];
        }
        this.spin_index = this.spin_index + 1;
        if (this.spin_index == 18) this.spin_index = 0;

        if (Server.stage == 1) { Server.bonus_num = [5, 10, 20]; }
        if (Server.stage == 2) {
            Server.bonus_num = [3, 5, 10, 15, 50];
            Server.prize_win = (Server.bonus_num[0] + Server.bonus_num[1] + Server.bonus_num[2]) * Bet.line_bet;
            Server.total_win = Server.prize_win;
        }
    }

    SetSymMoney(sym_num: number, sym_max: number) {
        switch (sym_num) {
            case 1: Server.sym_money = [50, 200, 1000]; break;
            case 2: Server.sym_money = [20, 80, 400]; break;
            case 3: Server.sym_money = [15, 40, 200]; break;
            case 4: Server.sym_money = [10, 30, 160]; break;
            case 5: Server.sym_money = [7, 20, 100]; break;
            case 6: Server.sym_money = [5, 15, 60]; break;
            case 7: Server.sym_money = [3, 10, 40]; break;
            case 8: Server.sym_money = [2, 5, 20]; break;
        }
        return Server.sym_money[sym_max];
    }

    Fake_Result(i: number) {
        switch (i) {
            case 0:
                Server.stage = 0;
                Server.sym_num = [7, 4, 1, 7, 10, 8, 0, 2, 5, 5, 9, 6, 3, 8, 6];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 1:
                Server.stage = 0;
                Server.sym_num = [6, 6, 7, 2, 10, 5, 4, 6, 5, 8, 1, 8, 9, 8, 3];
                Server.line_count = 2;
                Server.line_num[0] = 10;
                Server.line_symbol[0] = 6;
                Server.line_symbol_max[0] = 3;
                Server.line_num[1] = 17;
                Server.line_symbol[1] = 8;
                Server.line_symbol_max[1] = 4;
                break;
            case 2:
                Server.stage = 0;
                Server.sym_num = [9, 1, 6, 7, 2, 6, 3, 7, 0, 3, 4, 8, 10, 2, 5];
                Server.line_count = 0;//無線
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 3:
                Server.stage = 0;
                Server.sym_num = [5, 8, 1, 7, 2, 6, 5, 0, 4, 10, 3, 9, 5, 2, 8];
                Server.line_count = 1;
                Server.line_num[0] = 6;
                Server.line_symbol[0] = 5;
                Server.line_symbol_max[0] = 3;
                break;
            case 4:
                Server.stage = 1;
                Server.sym_num = [5, 3, 0, 9, 3, 0, 8, 5, 0, 7, 2, 6, 10, 1, 4];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 5:
                Server.stage = 0;
                Server.sym_num = [4, 5, 3, 7, 2, 7, 1, 5, 4, 10, 8, 6, 9, 2, 1];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 6:
                Server.stage = 0;
                Server.sym_num = [3, 6, 5, 4, 2, 1, 5, 9, 7, 7, 5, 2, 3, 5, 2];
                Server.line_count = 2;
                Server.line_num[0] = 1;
                Server.line_symbol[0] = 7;
                Server.line_symbol_max[0] = 3;
                Server.line_num[1] = 8;
                Server.line_symbol[1] = 5;
                Server.line_symbol_max[1] = 3;
                break;
            case 7:
                Server.stage = 0;
                Server.sym_num = [3, 8, 2, 4, 1, 7, 4, 9, 5, 8, 10, 6, 6, 6, 3];
                Server.line_count = 1;
                Server.line_num[0] = 4;
                Server.line_symbol[0] = 6;
                Server.line_symbol_max[0] = 4;
                break;
            case 8:
                Server.stage = 0;
                Server.sym_num = [6, 1, 5, 7, 7, 10, 3, 7, 2, 4, 5, 8, 8, 1, 9];
                Server.line_count = 2;
                Server.line_num[0] = 11;
                Server.line_symbol[0] = 7;
                Server.line_symbol_max[0] = 3;
                Server.line_num[1] = 16;
                Server.line_symbol[1] = 8;
                Server.line_symbol_max[1] = 3;
                break;
            case 9:
                Server.stage = 0;
                Server.sym_num = [7, 1, 6, 4, 9, 6, 5, 8, 2, 8, 10, 3, 7, 5, 1];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 10:
                Server.stage = 0;
                Server.sym_num = [5, 5, 1, 4, 6, 4, 2, 5, 3, 6, 9, 1, 10, 6, 0];
                Server.line_count = 2;
                Server.line_num[0] = 10;
                Server.line_symbol[0] = 5;
                Server.line_symbol_max[0] = 3;
                Server.line_num[1] = 17;
                Server.line_symbol[1] = 6;
                Server.line_symbol_max[1] = 3;
                break;
            case 11:
                Server.stage = 2;
                Server.sym_num = [8, 6, 5, 1, 10, 0, 4, 0, 6, 0, 3, 9, 2, 5, 7];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 12:
                Server.stage = 0;
                Server.sym_num = [8, 9, 8, 8, 4, 1, 10, 2, 5, 7, 7, 4, 6, 3, 0];
                Server.line_count = 1;
                Server.line_num[0] = 2;
                Server.line_symbol[0] = 8;
                Server.line_symbol_max[0] = 4;
                break;
            case 13:
                Server.stage = 0;
                Server.sym_num = [6, 2, 3, 10, 7, 7, 6, 0, 8, 4, 9, 1, 8, 5, 1];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 14:
                Server.stage = 0;
                Server.sym_num = [5, 2, 8, 9, 3, 7, 4, 0, 8, 6, 10, 7, 1, 5, 8];
                Server.line_count = 1;
                Server.line_num[0] = 9;
                Server.line_symbol[0] = 8;
                Server.line_symbol_max[0] = 3;
                break;
            case 15:
                Server.stage = 0;
                Server.sym_num = [4, 1, 7, 8, 6, 3, 10, 2, 8, 7, 0, 4, 6, 5, 9];
                Server.line_count = 0;
                Server.line_num = [];
                Server.line_symbol = [];
                Server.line_symbol_max = [];
                break;
            case 16:
                Server.stage = 0;
                Server.sym_num = [3, 6, 6, 6, 1, 9, 5, 7, 0, 5, 2, 4, 8, 7, 10];
                Server.line_count = 2;
                Server.line_num[0] = 13;
                Server.line_symbol[0] = 7;
                Server.line_symbol_max[0] = 3;
                Server.line_num[1] = 14;
                Server.line_symbol[1] = 6;
                Server.line_symbol_max[1] = 4;
                break;
            case 17:
                Server.stage = 0;
                Server.sym_num = [3, 5, 10, 5, 5, 8, 6, 4, 0, 7, 1, 9, 2, 7, 3];
                Server.line_count = 1;
                Server.line_num[0] = 3;
                Server.line_symbol[0] = 5;
                Server.line_symbol_max[0] = 4;
        }
    }
}
