class LogoStroke {
  constructor(opts) {

    this.color = opts.color || 0xFFE07A
    this.logoStroke = this.drawStroke()
    this.logoStrokeContainer = new PIXI.Container()

    this.logoStrokeContainer.addChild(this.logoStroke)

    this.position = vec2.create()
    this.velocity = vec2.create()
    this.scale = vec2.create()
    this.pivot = vec2.create()

    this.scale[0] = opts.scale || 1
    this.scale[1] = opts.scale || 1
    this.position[0] = opts.position.x || 0
    this.position[1] = opts.position.y || 0
    this.pivot[0] = opts.pivot.x || 0
    this.pivot[1] = opts.pivot.y || 0

    this.velocity[0]= opts.velocity || 0
    this.velocity[1]= opts.velocity || 0

    this.rotation = opts.rotation || 0

    stage.addChild(this.logoStrokeContainer)
  }
  update(count, funkyMode){
    //stage.removeChild(this.logoStrokeContainer)
    this.velocity[0] += count * 0.002
    this.velocity[1] += count * 0.002
    vec2.add( this.scale , this.scale , this.velocity )
    //this.logoStrokeContainer.scale.x += count * 0.004
    //this.logoStrokeContainer.scale.y += count * 0.004
    if (this.scale[0]>30) {
      this.logoStrokeContainer.alpha -= 0.02
    }

  }
  draw(){
    this.logoStrokeContainer.scale.x = this.scale[0]
    this.logoStrokeContainer.scale.y = this.scale[1]
    this.logoStrokeContainer.x = this.position[0]
    this.logoStrokeContainer.y = this.position[1]
    this.logoStrokeContainer.pivot.x = this.pivot[0]
    this.logoStrokeContainer.pivot.y = this.pivot[1]
    this.logoStrokeContainer.rotation = this.rotation
  }
  drawStroke(){
    var logoTemp = new PIXI.Graphics();
  // set a fill and line style
    logoTemp.lineStyle(2, this.color, 1);
    logoTemp.lineWidth = 1
    // draw a shape
    logoTemp.moveTo(495.738,216.827);
    logoTemp.lineTo(541.972,231.805);
    logoTemp.lineTo(557.192,267.469);
    logoTemp.lineTo(545.94,294.702);
    logoTemp.lineTo(563.568,305.732);
    logoTemp.lineTo(571.902,294.46);
    logoTemp.lineTo(570.129,282.612);
    logoTemp.lineTo(577.727,291.842);
    logoTemp.lineTo(570.447,309.252);
    logoTemp.lineTo(556.236,314.037);
    logoTemp.lineTo(541.244,305.966);
    logoTemp.lineTo(534.481,285.626);
    logoTemp.lineTo(537.566,282.605);
    logoTemp.lineTo(521.488,277.97);
    logoTemp.lineTo(511.487,271.946);
    logoTemp.lineTo(503.713,287.709);
    logoTemp.lineTo(497.427,334.773);
    logoTemp.lineTo(470.127,335.392);
    logoTemp.lineTo(458.926,326.59);
    logoTemp.lineTo(453.193,340.34);
    logoTemp.lineTo(434.476,343);
    logoTemp.lineTo(409.087,343);
    logoTemp.lineTo(399.261,327.492);
    logoTemp.lineTo(395.679,295.412);
    logoTemp.lineTo(385.104,297.764);
    logoTemp.lineTo(402.556,273.944);
    logoTemp.lineTo(440.284,248.906);
    logoTemp.lineTo(495.738,216.827);

    return logoTemp

  }
}

window.LogoStroke = LogoStroke
