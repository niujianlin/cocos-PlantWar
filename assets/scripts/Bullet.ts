// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Bullet extends cc.Component {
    srcHeight:number;

    @property
    speed:number = 200;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.srcHeight = cc.view.getCanvasSize().height;
    }

    // start () {

    // }

    update (dt:number) {
        this.node.y += this.speed * dt;
        if(this.node.y + this.node.height > this.srcHeight) {
            this.node.removeFromParent(true);
            this.destroy();
        }
    }

    die() {
        this.node.removeFromParent(true);
        this.destroy();
    }

}
