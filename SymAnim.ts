import BtnCtrl from "../UI/BtnControl";
import Server from "../GameSys/Server";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SymbolAnim extends cc.Component {

    @property(cc.Node) row: cc.Node[] = [];//5 15
    @property(cc.SpriteFrame) sym_idle: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) sym_blur: cc.SpriteFrame[] = [];
    @property(cc.SpriteFrame) sym_dark: cc.SpriteFrame[] = [];
    @property(sp.Skeleton) spine: sp.Skeleton[] = [];

    symbol: cc.Node[][] = [];
    VerToHor: Array<number> = [0, 3, 6, 9, 12, 1, 4, 7, 10, 13, 2, 5, 8, 11, 14];//直轉橫
    //HorToVer: Array<number> = [0, 5, 10, 1, 6, 11, 2, 7, 12, 3, 8, 13, 4, 9, 14];//橫轉直

    // LIFE-CYCLE CALLBACKS:

    onLoad() { for (let i = 0; i < BtnCtrl.row_max; i++) { this.symbol[i] = this.row[i].children; }}

    start() {  }//rowNum

    SymIdle(sym: Array<number>, row: number) {
        for (let i = 0; i < 15; i++) {
            if (BtnCtrl.row_max == 5) { if (row >= i % 5) { this.symbol[i % 5][Math.floor(i / 5) + 1].getComponent(cc.Sprite).spriteFrame = this.sym_idle[sym[i]]; } }
            else if (BtnCtrl.row_max == 15) {
                if (row >= this.VerToHor[i]) {
                    var correctNum = this.VerToHor[i]; this.symbol[correctNum][1].getComponent(cc.Sprite).spriteFrame = this.sym_idle[sym[i]];
                }//Sym_1
            }
        }
    }

    SymBlur(sym: Array<number>, row: number) {
        for (let i = 0; i < 15; i++) {
            if (BtnCtrl.row_max == 5) { if (i % 5 >= row) { this.symbol[i % 5][Math.floor(i / 5) + 1].getComponent(cc.Sprite).spriteFrame = this.sym_blur[sym[i]]; } }
            else if (BtnCtrl.row_max == 15) {
                if (this.VerToHor[i] > row) {
                    var correctNum = this.VerToHor[i]; this.symbol[correctNum][1].getComponent(cc.Sprite).spriteFrame = this.sym_blur[sym[i]];
                }//Sym_1
            }
        }
    }

    SymDark(sym: Array<number>, row: number) {
        for (let i = 0; i < 15; i++) {
            this.spine[i].setAnimation(0, "ALL_Close", false);
            if (BtnCtrl.row_max == 5) {
                if (row >= i % 5) {
                    this.symbol[i % 5][Math.floor(i / 5) + 1].getComponent(cc.Sprite).spriteFrame = this.sym_dark[sym[i]];
                }
            }
            else if (BtnCtrl.row_max == 15) {
                if (row >= this.VerToHor[i]) {
                    var correctNum = this.VerToHor[i];
                    this.symbol[correctNum][1].getComponent(cc.Sprite).spriteFrame = this.sym_dark[sym[i]];
                }//Sym_1
            }
        }
    }

    SymLineAnim(sym: Array<number>, line_index) {//動畫   
        for (let i = 0; i < Server.line_symbol_max[line_index]; i++) {
            var sym_str = Server.line_symbol[line_index];
            this.spine[sym[i]].setAnimation(0, "BA_SymbolM" + sym_str, true);
        }
    }

    SymCloseAnim() {
        for (let i = 0; i < 15; i++) {
            this.spine[i].setAnimation(0, "ALL_Close", false);
        }
    }
}
