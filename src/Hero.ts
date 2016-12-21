var Cache: MethodDecorator = (target: any, propertyName, desc: PropertyDescriptor) => {
    const getter = desc.get;
    desc.get = function () {
        return getter.apply(this);
    }
    return desc;
}


class User {
	private lvl: number;
	private exp: number;
	private gold: number;
	private cash: number;
	public hero: Hero[] = [];

	public constructor(lvl: number, exp: number, gold: number, cash: number, hero: Hero[]) {
		this.lvl = lvl;
		this.exp = exp;
		this.gold = gold;
		this.cash = cash;
		this.hero = hero;
	}

	public get heroesInTeam() {
		return this.hero.filter(hero => hero.isInTeam);
	}

	public get fightPower(): number {
		var result: number = 0;
		console.log(this.heroesInTeam);
		this.heroesInTeam.map(hero => result += hero.fightPower);
		return result;
	}

}



class Hero {
	public isInTeam: boolean;
	public heroName: string;
	private lvl: number = 1;
	private healthRatio: number = 1;
	private atkRatio: number = 1;
	public equipmentList: Equipment[] = [];
	public properties: Properties;

	public constructor(healthRatio: number, atkRatio: number, equipment: Equipment, heroName) {
		this.isInTeam = true;
		this.healthRatio = healthRatio;
		this.atkRatio = atkRatio;
		this.equipmentList.push(equipment);
		this.heroName = heroName;
		this.properties = new Properties();
		this.properties.all.push(new Property("等级", this.lvl))
		this.properties.all.push(new Property("生命值", this.maxHP))
		this.properties.all.push(new Property("攻击力", this.basicAtk))
	}

	public get maxHP(): number {
		return this.lvl * this.healthRatio;
		//return this.healthRatio * this.properties.all[0].value;
	}

	public get basicAtk(): number {
		var result: number = 0;
		result = this.lvl * this.atkRatio;
		console.log('英雄基础伤害：' + result)
		return result;
	}

	@Cache
	public get fightPower(): number {
		var result: number = 0;
		this.equipmentList.map(equipment => result += equipment.fightPower)          ////////// 装备攻击力 + 英雄基础攻击力 = 英雄的总攻击力
		result += this.basicAtk;
		return result;
	}


}


class Equipment {
	protected atk: number = 1;
	protected quality: Quality;
	protected equipmentLvl: number = 1;
	public properties: Properties;
	public equipmentName: string;

	constructor(atk: number, quality: Quality, equipmentLvl: number, equipmentName: string) {
		this.atk = atk;
		this.quality = quality;
		this.equipmentLvl = equipmentLvl;
		this.equipmentName = equipmentName;
		this.properties = new Properties();
	}

	public get fightPower(): number {
		return 1;
	}

}

class Weapon extends Equipment {
	private bullet: Bullet;
	//private isInHand:boolean;

	constructor(atk: number, quality: Quality, bullet: Bullet, equipmentLvl: number, equipmentName: string) {
		super(atk, quality, equipmentLvl, equipmentName);
		this.bullet = bullet;
		this.properties.all.push(new Property("等级", this.equipmentLvl));
		this.properties.all.push(new Property("质量", this.quality));
		this.properties.all.push(new Property("攻击力", this.basicAtk));
		this.properties.all.push(new Property("子弹加成", this.bullet.fightPower))
	}

	public get basicAtk(): number {
		var result: number = 0;
		result = this.atk * this.quality * this.equipmentLvl;
		console.log('武器基础伤害：' + result)
		return result;
	}

	public get fightPower(): number {
		return this.basicAtk * this.bullet.fightPower;
	}
}


class Bullet {
	private bulletType: BulletType;
	private bulletLvl: BulletLvl;

	constructor(bulletType: BulletType, bulletLvl: BulletLvl) {
		this.bulletType = bulletType;
		this.bulletLvl = bulletLvl;

	}

	public get fightPower(): number {
		var result: number = 0;
		result = this.bulletLvl * this.bulletType;
		console.log('子弹加成：' + result)
		return result;
	}

}


class Property {

	public name: string;

	public value: number;

	constructor(name: string, value: number) {
		this.name = name;
		this.value = value;
	}
}

class Properties {

	public all: Property[] = [];

	// public getProperty(){
	// 	return all
	// }

}

enum Quality {                          ////装备品质：白，蓝，紫，橙
	WHITE = 1,
	BLUE = 1.1,
	PURPLE = 1.2,
	ORANGE = 1.3
}

enum BulletType {
	NORMAL = 1,                         ////子弹类型：普通子弹，燃烧子弹，空尖子弹
	FLAMING = 1.03,
	JHP = 1.06
}

enum BulletLvl {
	GENERAL = 1,                        ////子弹等级：通用，警用，军用
	POLICE = 1.1,
	MILITARY = 1.2
}

function displayUtils(hero: Hero) {
	var container = new egret.DisplayObjectContainer();
	var tempString: string
	var tf = new egret.TextField();
	tempString = hero.heroName + "\n";
	// tempString = "";
	for (var p of hero.properties.all) {
		tempString = tempString + p.name + "：" + p.value + "\n";
		//tf.text = tempString;
		//container.addChild(tf);
	}
	for (var _equipment of hero.equipmentList) {
		//tempString = "";
		tempString = tempString + "装备：" + _equipment.equipmentName + "\n";
		for (var p of _equipment.properties.all) {
			tempString = tempString + p.name + "：" + p.value + "\n";
		}
		tempString = tempString + "英雄总攻击力" + hero.fightPower + "\n\n"
		tf.text = tempString;
	}
	tf.size = 18;
	container.addChild(tf);
	return container;
}