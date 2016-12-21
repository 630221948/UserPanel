var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Cache = function (target, propertyName, desc) {
    var getter = desc.get;
    desc.get = function () {
        return getter.apply(this);
    };
    return desc;
};
var User = (function () {
    function User(lvl, exp, gold, cash, hero) {
        this.hero = [];
        this.lvl = lvl;
        this.exp = exp;
        this.gold = gold;
        this.cash = cash;
        this.hero = hero;
    }
    var d = __define,c=User,p=c.prototype;
    d(p, "heroesInTeam"
        ,function () {
            return this.hero.filter(function (hero) { return hero.isInTeam; });
        }
    );
    d(p, "fightPower"
        ,function () {
            var result = 0;
            console.log(this.heroesInTeam);
            this.heroesInTeam.map(function (hero) { return result += hero.fightPower; });
            return result;
        }
    );
    return User;
}());
egret.registerClass(User,'User');
var Hero = (function () {
    function Hero(healthRatio, atkRatio, equipment, heroName) {
        this.lvl = 1;
        this.healthRatio = 1;
        this.atkRatio = 1;
        this.equipmentList = [];
        this.isInTeam = true;
        this.healthRatio = healthRatio;
        this.atkRatio = atkRatio;
        this.equipmentList.push(equipment);
        this.heroName = heroName;
        this.properties = new Properties();
        this.properties.all.push(new Property("等级", this.lvl));
        this.properties.all.push(new Property("生命值", this.maxHP));
        this.properties.all.push(new Property("攻击力", this.basicAtk));
    }
    var d = __define,c=Hero,p=c.prototype;
    d(p, "maxHP"
        ,function () {
            return this.lvl * this.healthRatio;
            //return this.healthRatio * this.properties.all[0].value;
        }
    );
    d(p, "basicAtk"
        ,function () {
            var result = 0;
            result = this.lvl * this.atkRatio;
            console.log('英雄基础伤害：' + result);
            return result;
        }
    );
    d(p, "fightPower"
        ,function () {
            var result = 0;
            this.equipmentList.map(function (equipment) { return result += equipment.fightPower; }); ////////// 装备攻击力 + 英雄基础攻击力 = 英雄的总攻击力
            result += this.basicAtk;
            return result;
        }
    );
    __decorate([
        Cache
    ], p, "fightPower", null);
    return Hero;
}());
egret.registerClass(Hero,'Hero');
var Equipment = (function () {
    function Equipment(atk, quality, equipmentLvl, equipmentName) {
        this.atk = 1;
        this.equipmentLvl = 1;
        this.atk = atk;
        this.quality = quality;
        this.equipmentLvl = equipmentLvl;
        this.equipmentName = equipmentName;
        this.properties = new Properties();
    }
    var d = __define,c=Equipment,p=c.prototype;
    d(p, "fightPower"
        ,function () {
            return 1;
        }
    );
    return Equipment;
}());
egret.registerClass(Equipment,'Equipment');
var Weapon = (function (_super) {
    __extends(Weapon, _super);
    //private isInHand:boolean;
    function Weapon(atk, quality, bullet, equipmentLvl, equipmentName) {
        _super.call(this, atk, quality, equipmentLvl, equipmentName);
        this.bullet = bullet;
        this.properties.all.push(new Property("等级", this.equipmentLvl));
        this.properties.all.push(new Property("质量", this.quality));
        this.properties.all.push(new Property("攻击力", this.basicAtk));
        this.properties.all.push(new Property("子弹加成", this.bullet.fightPower));
    }
    var d = __define,c=Weapon,p=c.prototype;
    d(p, "basicAtk"
        ,function () {
            var result = 0;
            result = this.atk * this.quality * this.equipmentLvl;
            console.log('武器基础伤害：' + result);
            return result;
        }
    );
    d(p, "fightPower"
        ,function () {
            return this.basicAtk * this.bullet.fightPower;
        }
    );
    return Weapon;
}(Equipment));
egret.registerClass(Weapon,'Weapon');
var Bullet = (function () {
    function Bullet(bulletType, bulletLvl) {
        this.bulletType = bulletType;
        this.bulletLvl = bulletLvl;
    }
    var d = __define,c=Bullet,p=c.prototype;
    d(p, "fightPower"
        ,function () {
            var result = 0;
            result = this.bulletLvl * this.bulletType;
            console.log('子弹加成：' + result);
            return result;
        }
    );
    return Bullet;
}());
egret.registerClass(Bullet,'Bullet');
var Property = (function () {
    function Property(name, value) {
        this.name = name;
        this.value = value;
    }
    var d = __define,c=Property,p=c.prototype;
    return Property;
}());
egret.registerClass(Property,'Property');
var Properties = (function () {
    function Properties() {
        this.all = [];
    }
    var d = __define,c=Properties,p=c.prototype;
    return Properties;
}());
egret.registerClass(Properties,'Properties');
var Quality;
(function (Quality) {
    Quality[Quality["WHITE"] = 1] = "WHITE";
    Quality[Quality["BLUE"] = 1.1] = "BLUE";
    Quality[Quality["PURPLE"] = 1.2] = "PURPLE";
    Quality[Quality["ORANGE"] = 1.3] = "ORANGE";
})(Quality || (Quality = {}));
var BulletType;
(function (BulletType) {
    BulletType[BulletType["NORMAL"] = 1] = "NORMAL";
    BulletType[BulletType["FLAMING"] = 1.03] = "FLAMING";
    BulletType[BulletType["JHP"] = 1.06] = "JHP";
})(BulletType || (BulletType = {}));
var BulletLvl;
(function (BulletLvl) {
    BulletLvl[BulletLvl["GENERAL"] = 1] = "GENERAL";
    BulletLvl[BulletLvl["POLICE"] = 1.1] = "POLICE";
    BulletLvl[BulletLvl["MILITARY"] = 1.2] = "MILITARY";
})(BulletLvl || (BulletLvl = {}));
function displayUtils(hero) {
    var container = new egret.DisplayObjectContainer();
    var tempString;
    var tf = new egret.TextField();
    tempString = hero.heroName + "\n";
    // tempString = "";
    for (var _i = 0, _a = hero.properties.all; _i < _a.length; _i++) {
        var p = _a[_i];
        tempString = tempString + p.name + "：" + p.value + "\n";
    }
    for (var _b = 0, _c = hero.equipmentList; _b < _c.length; _b++) {
        var _equipment = _c[_b];
        //tempString = "";
        tempString = tempString + "装备：" + _equipment.equipmentName + "\n";
        for (var _d = 0, _e = _equipment.properties.all; _d < _e.length; _d++) {
            var p = _e[_d];
            tempString = tempString + p.name + "：" + p.value + "\n";
        }
        tempString = tempString + "英雄总攻击力" + hero.fightPower + "\n\n";
        tf.text = tempString;
    }
    tf.size = 18;
    container.addChild(tf);
    return container;
}
//# sourceMappingURL=Hero.js.map