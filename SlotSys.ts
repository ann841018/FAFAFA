import BtnCtrl from "../UI/BtnControl";
import Server from "../GameSys/Server";
import Line from "../UI/Line";
import State from "../GameSys/GameState";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Slot extends cc.Component {

    @property(cc.Node) row: cc.Node[] = [];//5 15
    @property(cc.AudioSource) SE_stop: cc.AudioSource = null;

    symbol: cc.Node[][] = [];
    
    canStop: boolean = false;
    
    time: number = 0;//�p�ɾ�
    tem_time: number = 0;//�C�������ɶ�
    row_num: number = -1;//�ĴX��
    min_y: number = 0;//�W�X���
    max_y: number = 0;//����̤W��
    move_y: number[] = [];//���˦첾

    move_time: number = 20;//�]�w���ʮɶ�(����20������) ��h�[����
    move_speed: number = 32;//�첾�t��(32�첾4��40-5)

    start() {
        for (let i = 0; i < BtnCtrl.row_max; i++) { this.symbol[i] = this.row[i].children; } //rowNum
        for (let j = 0; j < this.symbol[0].length; j++) { this.move_y[j] = this.symbol[0][j].position.y; }//symNum
        this.min_y = -1 * this.symbol[0][0].height;
        this.max_y = this.symbol[0][0].position.y;
    }

    SetSpeed() {
        if (BtnCtrl.isTurbo == true) { this.tem_time = this.move_time; }
    }

    Spin() {//��l��
        this.time = this.time + 1;
        for (let j = 0; j < this.symbol[0].length; j++) {//symNum 0-3
            this.move_y[j] = this.move_y[j] - this.move_speed;
            if (this.move_y[j] <= this.min_y) this.move_y[j] = this.max_y;
        }
        for (let i = 0; i < BtnCtrl.row_max; i++) {//rowNum 0-4
            if (BtnCtrl.isStop == true) { if (i > this.row_num) { if (this.canStop == true) {//���U����
                if (this.time <= this.move_time * (i + 1)) this.tem_time = this.move_time * (i + 1); this.canStop = false;}}
            } else {
                if (BtnCtrl.isTurbo == false)
                    this.tem_time = this.move_time * (i + 1);
            }
            if (this.time <= this.tem_time) { if (i > this.row_num) {
                for (let j = 0; j < this.symbol[0].length; j++) {
                    this.symbol[i][j].position = cc.v3(0, this.move_y[j], 0);
                    this.node.getComponent("SymAnim").SymBlur(Server.sym_num, i);
                }}
            } else { this.row_num = i; this.node.getComponent("SymAnim").SymIdle(Server.sym_num, i); if (this.time == this.tem_time + 1) this.SE_stop.play(); }//�ఱ
        }//end for i
        if (this.time > this.tem_time) { State.state_id = "Stop"; }//������
    }

    Stop() {
        this.time = 0; this.row_num = -1;  
        for (let j = 0; j < this.symbol[0].length; j++) { this.move_y[j] = this.symbol[0][j].position.y; }//���s�w��  
        if (Server.line_count > 0) { State.state_id = "Anim"; }
        else if (Server.stage != 0) { if (State.stage_id != "Prize") State.stage_id = "Start"; State.state_id = "Stage"; } 
        else State.state_id = "Idle";
    }

    Anim() {
        if (Line.isLine == true) {
            for (let i = 0; i < BtnCtrl.row_max; i++) { this.node.getComponent("SymAnim").SymDark(Server.sym_num, i); } //�s�u               
            this.node.getComponent("SymAnim").SymLineAnim(Line.lineSym, Line.line_index);
        }
        this.time = this.time + 1;
        if (this.time >= Server.line_count * 120) {
            if (Server.stage == 0) { State.state_id = "Win"; }
            else { if (State.stage_id != "Prize") State.stage_id = "Start"; State.state_id = "Stage"; } 
        }
    }

    ReSet() {
        this.time = 0; this.canStop = true;
        for (let i = 0; i < BtnCtrl.row_max; i++) { this.node.getComponent("SymAnim").SymIdle(Server.sym_num, i); }
    }
}