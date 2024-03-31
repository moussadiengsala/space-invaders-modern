
export class ResourceManager {
    constructor() {
        this.images = {};
        this.audios = {};
    }

    loadImage(key, url) {
        const image = new Image();
        const promise = new Promise((resolve, reject) => {
            image.onload = () => {
                this.setValue(this.images, key.split("."), image);
                resolve(image);
            };
            image.onerror = reject;
        });
        image.src = url;
        return promise;
    }

    loadAudio(key, url) {
        const audio = new Audio(url);
        const promise = new Promise((resolve, reject) => {
            audio.oncanplaythrough = () => {
                this.setValue(this.audios, key.split("."), audio);
                resolve(audio);
            };
            audio.onerror = reject;
        });
        audio.src = url;
        return promise;
    }

    setValue(obj, keys, value) {
        let currentObj = obj;
        const lastKeyIndex = keys.length - 1;
        for (let i = 0; i < lastKeyIndex; i++) {
            const key = keys[i];
            currentObj[key] = currentObj[key] || {};
            currentObj = currentObj[key];
        }
        const lastKey = keys[lastKeyIndex];
        currentObj[lastKey] = value;
    }

    getResource(keys) {
        let currentObj = this.nestedResources;
        for (const key of keys) {
            if (!currentObj[key]) {
                return undefined;
            }
            currentObj = currentObj[key];
        }
        return currentObj;
    }

    resourceLoader() {
        return Promise.all([
            // player textures
            this.loadImage('player.100', "/assets/characters/main-ship-base/PNGs/full-health.png"),
            this.loadImage("player.75", '/assets/characters/main-ship-base/PNGs/slight-damage.png'),
            this.loadImage("player.50", '/assets/characters/main-ship-base/PNGs/damaged.png'),
            this.loadImage("player.25", "/assets/characters/main-ship-base/PNGs/very-damage.png"),
            this.loadImage("player.0", "/assets/characters/main-ship-base/PNGs/very-damage.png"),
            
            // enemies texture
            this.loadImage("enemie.1.100", "/assets/characters/enemies/soldier/enemy-1/base.png"),
            this.loadImage("enemie.1.0", "/assets/characters/enemies/soldier/enemy-1/destruction.png"),
            this.loadImage("enemie.2.100", "/assets/characters/enemies/soldier/enemy-2/base.png"),
            this.loadImage("enemie.2.0", "/assets/characters/enemies/soldier/enemy-2/destruction.png"),

            // weapons
            this.loadImage("weapon.bigSpaceGun", "/assets/characters/weapons/PNGs/weapons-big-space-gun.png"),
            this.loadImage("weapon.autoCannon", "/assets/characters/weapons/PNGs/weapons-auto-cannon.png"),
            this.loadImage("weapon.zapper", "/assets/characters/weapons/PNGs/weapons-zapper.png"),
            this.loadImage("weapon.rockets", "/assets/characters/weapons/PNGs/weapons-rockets.png"),

            // projectile
            this.loadImage("projectile.cannon", "/assets/characters/projectile/PNGs/auto-cannon.png"),
            this.loadImage("projectile.bigSpaceGun", "/assets/characters/projectile/PNGs/big-space-gun.png"),
            this.loadImage("projectile.autoCannon", "/assets/characters/projectile/PNGs/auto-cannon.png"),
            this.loadImage("projectile.rockets", "/assets/characters/projectile/PNGs/rockets.png"),
            this.loadImage("projectile.zapper", "/assets/characters/projectile/PNGs/zapper.png"),

            // exhausts
            this.loadImage("exhaust.exhaust", "/assets/characters/exhausts/PNGs/exhaust10.png"),

            // exhausts engine
            this.loadImage("exhaust.engine", "/assets/characters/engin-exhausts/PNGs/engin-exhausts3.png"),

            // map icons
            this.loadImage("map.icons.lava", "../../assets/maps/Lava.png"),
            this.loadImage("map.icons.ice", "../../assets/maps/Ice.png"),
            this.loadImage("map.icons.terran", "../../assets/maps/Terran.png"),
            this.loadImage("map.icons.baren", "../../assets/maps/Baren.png"),

            // map
            this.loadImage("map.lava", "/assets/maps/lava-background.png"),
            this.loadImage("map.ice", "/assets/maps/ice-background.png"),
            this.loadImage("map.terran", "/assets/maps/terran-background.png"),
            this.loadImage("map.baren", "/assets/maps/baren-background.png"),

            // button
            this.loadImage("button.spaceKey", "../../assets/buttons/Space-Key.png"),
            this.loadImage("button.cKey", "../../assets/buttons/C-Key.png"),

            // audio fire
            this.loadAudio("fire", "../../../assets/audio/LASRGun_Blaster star wars 2 (ID 1758)_LS.wav"),

            // audio click
            this.loadAudio("click", "../../assets/audio/click-sound.wav"),

            // audio game over
            this.loadAudio("gameOver", "../../assets/audio/mixkit-laser-game-over-1946.wav"),

            // audio background music
            this.loadAudio("backgroundSound", "../../assets/audio/background-music.mp3"),

            // explosion effect
            this.loadAudio("explosion", "../../../assets/audio/explosion-nearby-gamemaster-audio-1-00-01.mp3"),
        ]);
    }
}


