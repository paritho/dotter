const { bind, wire } = hyperHTML;

class GameCanvas extends HTMLElement {
  constructor(...args) {
    super(...args);
    this.html = bind(this);
  }

  connectedCallback() {
    this.resolution = this.getAttribute("resolution") || 24;
    this.width = this.getAttribute("size") || 800;
    this.height = this.width;
    this.dotsize = Math.floor(+this.width / (+this.resolution * 2));
    this.dotshare = Math.ceil(this.width / this.resolution);
    this.dots = Array(this.resolution * this.resolution)
                  .fill(0)
                  .map((dot, idx) => {
                    dot = {
                      x:this.getXByIndex(idx),
                      y:this.getYByIndex(idx),
                      size: this.dotsize
                    };
                    
                    return wire(dot)`<game-dot 
                            x=${dot.x} 
                            y=${dot.y} 
                            size=${dot.size}>
                        </game-dot>`;
    });
    this.board = this.makeBoard();
    this.render();
  }

  getDotByXY(x, y) {
    return this.dots[this.getIndexByXY(x,y)];
  }

  getDotByIndex(idx){
      return this.dots[idx];
  }

  getIndexByXY(x, y){
      return x + y * this.resolution;
  }

  getXByIndex(idx) {
      return idx % this.resolution;
  }
  getYByIndex(idx) {
      return  Math.floor(idx / this.resolution)
  }

  getXYByIndex(idx) {
    return {
      x: this.getXByIndex(idx),
      y: this.getYByIndex(idx)
    };
  }

  setDotProperties(dot, props) {
    for (const prop in props) {
      if (dot[prop]) {
        dot[prop] = props[prop];
      }
    }
  }

  setMultipleDotsProperties(dots, props){
    //dots = [{x,y},{x,y}];
    dots.forEach((coord) => {
      const idx = this.getIndexByXY(coord.x, coord.y);
      const dot = this.getDotByIndex(idx);
      this.setDotProperties(dot, props);
    });
  }

  setDotPropsInRange(range, props){
    //range = {x:[start, end], y:[start, end]}
    const xR = range.x;
    const yR = range.y;
    if(xR.length !== yR.length){
      console.error('Range Lengths must match');
    }
    const xStart = xR[0],
          xEnd = xR[1],
          yStart = yR[0],
          yEnd = yR[1];
    
    const xDotRange = Array.from(Array(xEnd - xStart + 1), (_,idx)=> xStart + idx);
    const yDotRange = Array.from(Array(yEnd - yStart + 1), (_,idx)=> yStart + idx);
    const dots = [];
    yDotRange.forEach(y =>{
      xDotRange.forEach(x => {
        dots.push({
          x,
          y
        })
      })
    })
    this.setMultipleDotsProperties(dots,props);
  }

  makeBoard() {
    const board = wire()`<div class="board"></div>`;
    const styles = {
      width: this.width,
      height: this.height,
      display: "grid",
      gridTemplateColumns: `repeat(${this.resolution}, ${this.dotshare}px)`,
    };
    Object.assign(board.style, styles);
    return board;
  }

  render() {
    bind(this.board)`${this.dots.map(dot => dot)}`;
    this.html`${this.board}`;
  }
}

export default GameCanvas;
