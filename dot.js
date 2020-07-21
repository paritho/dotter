const { bind, wire } = hyperHTML;

class GameDot extends HTMLElement {
  constructor(...args) {
    super(...args);
    this.html = bind(this);
  }

  set color(value){
      this._color = value;
      this.render();
  }
  get color(){
    return this._color;
  }

  set size(value){
    this._size = value;
    this.render();
  }
  get size(){
    return this._size;
  }

  connectedCallback() {
    this.color = this.getAttribute("color") || "black";
    this.x = this.getAttribute("x");
    this.y = this.getAttribute("y");
    this.render();
  }
  render() {
    const dot = wire()`<span data-x=${this.x} 
                             data-y=${this.y}
                             style=${`width: ${this.size};
                                      height: ${this.size};
                                      background-color:${this.color};
                                      border:1px solid ${this.color};
                                      transform:scale(${this.scale});
                                    `}
                       ></span>`;
    this.html`${dot}`;
  }
}

export default GameDot;
