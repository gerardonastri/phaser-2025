export let GameData: gameData = {
  globals: {
    gameWidth: 1920,
    gameHeight: 1080,
    bgColor: "#000000",
    debug: false
  },

  preloader: {
    bgColor: "ffffff",
    image: "logo",
    imageX: 1920 / 2,
    imageY: 1080 / 2,
    loadingText: "Caricamento...",
    loadingTextFont: "roboto",
    loadingTextComplete: "Tappa/clicca per iniziare!!",
    loadingTextY: 700,
    loadingBarColor: 0xff0000,
    loadingBarY: 630,
  },

  spritesheets: [
    //player
    {name: "playerSheet_top", path:"assets/chrcter/player/playerSheet_top.png", width: 128, height: 128, frames: 49},
    {name: "playerSheet_bottom", path:"assets/chrcter/player/playerSheet_bottom.png", width: 128, height: 128, frames: 29},
    //texture ground
    {name: "textureGround", path:"assets/ground/texture.png", width: 640, height: 360, frames: 1}

  ],
  images: [

    //ground
    { name: "prospetticGrid", path: "assets/ground/prospettic_lines.png" },
    { name: "maskGround", path: "assets/ground/mask.png" },
    { name: "texture_ground", path: "assets/ground/texture_path.png" },
    { name: "linesGround", path: "assets/ground/lines.png" },
    { name: "coll", path: "assets/ground/coll.png" },

    
    { name: "sword0", path: "assets/ground/sword.png" },
    { name: "path", path: "assets/ground/path.png" },
    { name: "UI_prova", path: "assets/UI/ornamental_prova.png" },

    //props
    { name: "props0", path: "assets/ground/props/props0.png" },
    { name: "props1", path: "assets/ground/props/props1.png" },
    { name: "props2", path: "assets/ground/props/props2.png" },
    { name: "props3", path: "assets/ground/props/props3.png" },
    { name: "props4", path: "assets/ground/props/props4.png" },
    { name: "props5", path: "assets/ground/props/props5.png" },
    { name: "props6", path: "assets/ground/props/props6.png" },


  ],
  atlas: [],
  sounds: [
    /*{
    name: "music",
    paths: ["assets/sounds/intro.ogg", "assets/sounds/intro.m4a"],
    volume: 1,
    loop: true,
    frame: 1,
  }*/
  ],

  videos: [

    // { name: "video", path: "/assets/video/video.mp4" },

  ],
  audios: [

    /*{
    name: "sfx",
    jsonpath: "assets/sounds/sfx.json",
    paths: ["assets/sounds/sfx.ogg", "assets/sounds/sfx.m4a"],
    instances: 10,
  }*/
  ],

  scripts: [],
  fonts: [{key:"ralewayRegular", path:"assets/fonts/raleway.regular.ttf",type:"truetype"}],
  webfonts: [{ key: 'Nosifer' }, { key: 'Roboto' }, { key: 'Press+Start+2P' }, { key: 'Rubik+Doodle+Shadow' }, { key: 'Rubik+Glitch' }],
  bitmapfonts: [],
};
