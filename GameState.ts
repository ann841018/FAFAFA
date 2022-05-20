import Server from "./Server";

const {ccclass, property} = cc._decorator;

@ccclass
export default class State extends cc.Component {

    @property(cc.Node) Server: cc.Node = null;
    @property(cc.Node) Wheel: cc.Node = null;
    @property(cc.Node) Bet: cc.Node = null;
    @property(cc.Node) Bottom: cc.Node = null;
    @property(cc.Node) Line: cc.Node = null;
    @property(cc.Node) BonusGame: cc.Node = null;
    @property(cc.Node) FreeSpin: cc.Node = null;
    @property(cc.Node) Auto: cc.Node = null;

    public static state_id: string = "Idle";
    public static stage_id: string = "Start";
    
    update() {
        switch (State.state_id)
        {
            case "Idle":
                this.Idle();
                break;
            case "CanPush":
                this.CanPush();
                break;
            case "PushSpin":
                this.PushSpin();
                break;
            case "Spin":
                this.Spin();
                break;
            case "Stop":
                this.Stop();
                break;
            case "Anim":
                this.Anim();
                break;
            case "Stage":
                this.Stage();
                break;
            case "Win":
                this.Win();
                break;
        }
        console.log(State.state_id);
    }

    Idle() {//1´V
        this.Wheel.getComponent("SlotSys").ReSet();
        this.Line.getComponent("Line").ResetLine();
        this.Bottom.getComponent("BtnControl").Reset();
        State.state_id = "CanPush";
    }

    CanPush() { this.Auto.getComponent("Auto").IfAuto(); }

    PushSpin() { //1´V
        if (State.stage_id != "Doing") this.Bet.getComponent("Bet").Bet();
        this.Server.getComponent("Server").Spin_Result();
        if (State.stage_id == "Doing") this.FreeSpin.getComponent("FreeSpin").DoFreeSpin();
        this.Bottom.getComponent("BtnControl").PushSpin();
        this.Wheel.getComponent("SymAnim").SymCloseAnim();
        this.Wheel.getComponent("SlotSys").SetSpeed();
        this.Bottom.getComponent("Money").ReSet();
        State.state_id = "Spin";
    }

    Spin() { //update
        this.Wheel.getComponent("SlotSys").Spin();
        this.Bottom.getComponent("BtnControl").isSpin();
    }

    Stop() { //1´V
        this.Wheel.getComponent("SlotSys").Stop();
        this.Bottom.getComponent("BtnControl").CantPushSpin();
    }

    Anim() { //update
        this.Line.getComponent("Line").Line();
        this.Wheel.getComponent("SlotSys").Anim();
    }

    Stage() {
        switch (State.stage_id) {
            case "Start":
                if (Server.stage == 1) { this.FreeSpin.getComponent("FreeSpin").Enter(); }
                else if (Server.stage == 2) { this.BonusGame.getComponent("Bouns").Enter(); }
                break;
            case "Doing":
                this.Bottom.getComponent("BtnControl").isStage();
                if (Server.stage == 1) { this.Auto.getComponent("Auto").IfAuto(); }
                if (Server.stage == 2) { this.BonusGame.getComponent("Bouns").BonusGame(); }
                break;
            case "Prize":
                if (Server.stage == 1) this.FreeSpin.getComponent("FreeSpin").Prize();
                else if (Server.stage == 2) this.BonusGame.getComponent("Bouns").Prize();
                break;
            case "End":
                if (Server.stage == 1) this.FreeSpin.getComponent("FreeSpin").End();
                else if (Server.stage == 2) this.BonusGame.getComponent("Bouns").End();
                break;
        }
    }

    Win() { this.Bottom.getComponent("Money").SetMoney(); }
}
