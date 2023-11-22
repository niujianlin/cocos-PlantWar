// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Background from "./Background";
import Bullet from "./Bullet";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Enemy extends cc.Component {
    srcWidth:number;
    srcHeight:number;

    frameId:number = 1;
    isDead:boolean = false;
    
    @property
    speed:number = 150;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.srcWidth = cc.view.getCanvasSize().width;
        this.srcHeight = cc.view.getCanvasSize().height;
    }

    start () {
        this.node.y = this.srcHeight + this.node.height;
        this.node.x = Math.random() * (this.srcWidth - this.node.width) +this.node.width/2;
    }

    update (dt:number) {
        this.node.y -= this.speed * dt;
        if(this.node.y - this.node.height/2 <0) {
            this.node.removeFromParent(true);
            this.destroy();
        }
    }

    /**
     * 当敌机碰到（有效）子弹、敌机碰到玩家飞机
     * @param other 子弹或玩家的飞机
     */
    onCollisionEnter(other:cc.Collider) {
        if(other.tag == 9 && !this.isDead) {
            cc.find("Background").getComponent(Background).score ++;
            cc.find("lblScore").getComponent(cc.Label).string = "分数："
                +cc.find("Background").getComponent(Background).score;
            this.die();
            other.getComponent(Bullet).die();
        }else if(other.tag == 0 && !this.isDead) {
            // 游戏结束
            cc.game.pause();
            cc.find("Background").getComponent(cc.AudioSource).stop();
            alert("game over");
        }
    }

    die() {
        this.isDead = true;
        cc.resources.load("audio/boom", cc.AudioClip, (error, clip:cc.AudioClip) => {
            cc.audioEngine.playEffect(clip, false);
        })
        this.schedule(()=> {
            cc.resources.load(`images/explosion${this.frameId}`,cc.SpriteFrame, (error, sf:cc.SpriteFrame) => {
                this.getComponent(cc.Sprite).spriteFrame = sf;
                this.frameId++;
            });
        }, 0.01, 19, 0);
    }

}
