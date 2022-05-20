import Server from "../GameSys/Server";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Line extends cc.Component {

    @property(cc.Node) line: cc.Node[] = [];//9
    @property(cc.Node) light_L: cc.Node[] = [];//9
    @property(cc.Node) light_R: cc.Node[] = [];//9
    @property(cc.Node) dark_L: cc.Node[] = [];//9
    @property(cc.Node) dark_R: cc.Node[] = [];//9
    @property(cc.Label) line_money: cc.Label[] = [];//9
    @property(cc.AudioSource) SE_line: cc.AudioSource = null;

    public static isLine: boolean = false;
    public static lineSym: Array<number> = [];
    public static line_index: number = 0;
    time: number = 0;

    Line() {
        if (Line.line_index < Server.line_count) {
            this.time = this.time + 1;
            if (this.time > 105) { Line.line_index = Line.line_index + 1; this.time = -15; }
            else if (this.time > 45) { this.HideLine(); Line.isLine = false; }//關掉線
            else if (this.time > 15) { if (Line.isLine == false) this.LineMap(); }//顯示線的時間
        } 
    }

    LineMap() {
        switch (Server.line_num[Line.line_index]) {//畫線
            case 0: Line.lineSym = [5, 6, 7, 8, 9]; break;
            case 1: Line.lineSym = [9, 8, 7, 6, 5]; break;
            case 2: Line.lineSym = [0, 1, 2, 3, 4]; break;
            case 3: Line.lineSym = [4, 3, 2, 1, 0]; break;
            case 4: Line.lineSym = [10, 11, 12, 13, 14]; break;
            case 5: Line.lineSym = [14, 13, 12, 11, 10]; break;
            case 6: Line.lineSym = [0, 6, 12, 8, 4]; break;
            case 7: Line.lineSym = [4, 8, 12, 6, 0]; break;
            case 8: Line.lineSym = [10, 6, 2, 8, 14]; break;
            case 9: Line.lineSym = [14, 8, 2, 6, 10]; break;
            case 10:Line.lineSym = [0, 1, 7, 3, 4]; break;
            case 11:Line.lineSym = [4, 3, 7, 1, 0]; break;
            case 12:Line.lineSym = [10, 11, 7, 13, 14]; break;
            case 13:Line.lineSym = [14, 13, 7, 11, 10]; break;
            case 14:Line.lineSym = [5, 1, 2, 3, 9]; break;
            case 15:Line.lineSym = [9, 3, 2, 1, 5]; break;
            case 16:Line.lineSym = [5, 11, 12, 13, 9]; break;
            case 17:Line.lineSym = [9, 13, 12, 11, 5]; break;
        }
        this.ShowLine(); Line.isLine = true;//動畫
        return Line.lineSym; 
    }

    ShowLine() {
        this.SE_line.play();
        for (let i = 0; i < Server.line_max; i++) { this.dark_L[i].active = true;this.dark_R[i].active = true; }
        this.line[Math.floor(Server.line_num[Line.line_index] / 2)].active = true;
        this.line_money[Math.floor(Server.line_num[Line.line_index] / 2)].string = this.FormatStr(Server.line_win[Line.line_index].toString());
        if (Server.line_num[Line.line_index] % 2 == 0) { this.light_L[Math.floor(Server.line_num[Line.line_index] / 2)].active = true; }
        else { this.light_R[Math.floor(Server.line_num[Line.line_index] / 2)].active = true; }        
    }

    HideLine()
    {
        this.line[Math.floor(Server.line_num[Line.line_index] / 2)].active = false;
        if (Server.line_num[Line.line_index] % 2 == 0) { this.light_L[Math.floor(Server.line_num[Line.line_index] / 2)].active = false; }
        else { this.light_R[Math.floor(Server.line_num[Line.line_index] / 2)].active = false; }       
    }

    ResetLine() {
        for (let i = 0; i < Server.line_max; i++) {
            this.line[i].active = false;
            this.light_L[i].active = false;
            this.light_R[i].active = false;
            this.dark_L[i].active = false;
            this.dark_R[i].active = false;
        }
        this.time = 0;
        Line.line_index = 0;
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
