import GameDot from "./dot.js";
import GameCanvas from "./canvas.js";

customElements.define("game-dot", GameDot);
customElements.define("game-canvas", GameCanvas);

const canvas = document.querySelector("game-canvas");

const Dotter = (config) => {
  return {
    hero: {},
    villian: [{}],
    _gameOver: false,
    start() {
      if (config.create && typeof config.create === "function") {
        config.create({
            gotter:this._gotter,
            sotter:this._sotter, 
            multiSotter: this._multiSotter,
            rangeSotter:this._rangeSotter,
            allDots: this._AllDots
          });
      }
      canvas.render();
      requestAnimationFrame(this.gameRunner.bind(this));
    },
    gameRunner(time) {
      config.updotter({
          gotter:this._gotter,
          sotter:this._sotter, 
          multiSotter: this._multiSotter,
          rangeSotter:this._rangeSotter,
          end:this._endDotter.bind(this),
          allDots:this._allDots
        });
      canvas.render();
      if (!this._gameOver) {
        requestAnimationFrame(this.gameRunner.bind(this));
      }
    },
    _endDotter(){
      this._gameOver = true;
    },
    _sotter(x, y, props) {
      const dot = canvas.getDotByXY(x, y);
      canvas.setDotProperties(dot, props);
    },
    _multiSotter(dots, props){
      canvas.setMultipleDotsProperties(dots, props);
    },
    _rangeSotter(range, props){
      canvas.setDotPropsInRange(range, props);
    },
    _allDots(){
      return canvas.getAllDots();
    },
    _gotter(x, y) {
      const idx = canvas.getIndexByXY(x, y);
      return canvas.getDotByIndex(idx);
    },
  };
};

export default Dotter;
