import GameDot from "./dot.js";
import GameCanvas from "./canvas.js";

customElements.define("game-dot", GameDot);
customElements.define("game-canvas", GameCanvas);

const canvas = document.querySelector("game-canvas");

const Dotter = (config) => {
  return {
    dotForge: (attr) => {
      const collectDots = (x,y)=>{
        let dots;
        if(x.length && y.length){
          dots = canvas.getDotsInRange({x, y});
        } else {
          dots = [canvas.getDotByXY(x, y)];
        }
        return dots;
      }
      return {
        x: attr.x,
        y: attr.y,
        moveTo(x, y) {
          const dots = collectDots(this.x,this.y);
          dots.forEach(dot => canvas.resetDot(dot));
          this.x = x;
          this.y = y;
        },
        props:{
          color: attr.color,
          size: attr.size,
        }
      };
    },
    villian: [{}],
    _gameOver: false,
    start() {
      canvas.addEventListener("click", this._onclick);
      canvas.addEventListener("keydown", this._onkeydown);
      if (config.create && typeof config.create === "function") {
        config.create({
          gotter: this._gotter,
          sotter: this._sotter,
          multiSotter: this._multiSotter,
          rangeSotter: this._rangeSotter,
          allDots: this._allDots,
          dotForge: this.dotForge
        });
      }
      canvas.focus();
      requestAnimationFrame(this.gameRunner.bind(this));
    },
    gameRunner(time) {
      config.updotter({
        gotter: this._gotter,
        sotter: this._sotter,
        multiSotter: this._multiSotter,
        rangeSotter: this._rangeSotter,
        end: this._endDotter.bind(this),
        allDots: this._allDots,
      });
      canvas.render();
      if (!this._gameOver) {
        requestAnimationFrame(this.gameRunner.bind(this));
      }
    },
    _onclick(e) {
      const clickedDot = e.target;
      const data = clickedDot.dataset;
      if (data?.type && data.type !== "dot") {
        return;
      }
      const dot = canvas.getDotByXY(data.x, data.y);
      config.onclick(dot);
    },
    _onkeydown(e) {
      config.onkeydown(e.key);
    },
    _endDotter() {
      canvas.removeEventListener("click", this._onclick);
      canvas.removeEventListener("keydown", this._onkeydown);
      this._gameOver = true;
    },
    _sotter(dot, props) {
      dot = canvas.getDotByXY(dot.x, dot.y);
      canvas.setDotProperties(dot, props);
    },
    _multiSotter(dots, props) {
      if(!props && dots.props){
        props = dots.props;
      }
      canvas.setMultipleDotsProperties(dots, props);
    },
    _rangeSotter(range, props) {
      if(!props && range.props){
        props = range.props;
      }
      canvas.setDotPropsInRange(range, props);
    },
    _allDots() {
      return canvas.getAllDots();
    },
    _gotter(x, y) {
      const idx = canvas.getIndexByXY(x, y);
      return canvas.getDotByIndex(idx);
    },
  };
};

export default Dotter;
