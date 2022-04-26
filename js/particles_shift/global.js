function renderOnCanvas(text) {
  // osc.clear();
  let splitString = [...text];
  osc.noFill();
  osc.strokeWeight(3);
  osc.textAlign(CENTER);
  osc.textBaseline('bottom');
  osc.textFont(config.fontFamily);
  let text_size =(windowWidth*3 / windowHeight) * FONT_SIZE
  osc.textSize(text_size);
  // osc.text(text, windowWidth / 2, windowHeight / 2, windowWidth, 100);
  // var words = splitString.split(' ');
  for (var n = 0; n < text.length; n++) {
    osc.text(text[n], windowWidth / 2, (n+1)*text_size +50, windowWidth, 100);
  }
  // let url =
  //   "https://anuraghazra.dev/CanvasFun/TextParticles/src/images/mypic.jpg";
  // let img = c.loadImage(url);
  // img.setAttribute("crossOrigin", "");
  // osc.image(img, 25, 25, windowWidth, 100);
}
  
  function getPixelCoords() {
    let gridX = gridY = 3;
    let w = windowWidth;
    let h = windowHeight;
  
    let newPos = [];
  
    // get pixel coordinates
    let imagedata = osc.ctx.getImageData(0, 0, w, h);
    let pixels = new Int32Array(imagedata.data.buffer);
    for (let x = 0; x < w; x += gridX) {
      for (let y = 0; y < h; y += gridY) {
        if (pixels[(x + y * w)]) {
          newPos.push({ x, y })
        }
      }
    }
  
    // add new particles
    while (newPos.length > particles.length) {
      let newp = new Point(
        particles[randomInt(0, particles.length - 1)].pos.x,
        particles[randomInt(0, particles.length - 1)].pos.y,
        'rgba(255,255,255,0.9)', true
      )
      particles.push(newp);
    }
    let requireLen = (particles.length - newPos.length);
  
    // Set Text Target
    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      if (p.active) p.reset();
      if (i > requireLen) {
        for (let j = 0; j < newPos.length; j++) {
          p.blast();
          p.setTarget(newPos[(i + j) % newPos.length].x, newPos[(i + j) % newPos.length].y)
          p.color = 'rgba(255,255,255,0.9)';
          p.active = true;
        }
      }
    }
  }