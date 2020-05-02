export default function Animate() {
    const self = this;
    self.tweens = []
  };
  
  Animate.prototype.stopAnimation = function () {
    const self = this;
  
    self.tweens.forEach(tween => tween.kill())
    self.tweens = [];
    self.stopTimer()
  }
  
  Animate.prototype.startAnimation = function (ctx, dim, links_by_year, dur, drawLinks) {
    const self = this;
  
    const years = Object.keys(links_by_year),
      full_duration_ms = (years.length*dur+dur)*1000;
    self.stopAnimation()
    self.animateLinks(years, links_by_year, dur);
    self.startTimer(ctx, dim, full_duration_ms, drawLinks)
  }
  
  Animate.prototype.animateLinks = function (years, links_by_year, dur) {
    const self = this;
    for (let i = 0; i < years.length; i++) {
      const links = links_by_year[years[i]],
        delay_spread = dur/(links.length-1)
  
      for (let j = 0; j < links.length; j++) {
        const d = links[j],
          delay = dur*i + (j*delay_spread)
        d.t = 0;
        d.alpha = 1;
        self.tweens.push(gsap.to(d, dur, {t: 1, delay}))
        if (i < years.length-1) self.tweens.push(gsap.to(d, 1.5, {alpha: 0, delay: delay+1.5}))
      }
    }
  }
  
  Animate.prototype.startTimer = function (ctx, dim, full_duration_ms, drawLinks) {
    const self = this;
    const timer = self.timer = d3.timer(tick)
    function tick(t) {
      if (t > full_duration_ms) timer.stop()
      ctx.clearRect(0,0,dim.width, dim.height);
      drawLinks();
    }
  }
  
  Animate.prototype.stopTimer = function () {
    const self = this;
    if (self.timer) self.timer.stop()
  }
  