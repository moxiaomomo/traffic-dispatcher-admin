// 星星粒子效果
export function particles(canvasID: string) {
  const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  let ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }

  const canvas2 = document.createElement('canvas') as HTMLCanvasElement;
  if (!canvas2) {
    return;
  }
  let ctx2 = canvas2.getContext('2d');
  if (!ctx2) {
    return;
  }
  canvas2.width = 100;
  canvas2.height = 100;

  const randomFunc = (min: number, max: number) => {
    if (min > max) {
      var hold = max;
      max = min;
      min = hold;
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  let width = (canvas.width = window.innerWidth),
    height = (canvas.height = window.innerHeight),
    hue = 217,
    stars: any[] = [];
  // 单位区域系数
  const unitScale = Math.floor((width * height) / 150000);
  //星星数量
  const maxStars = unitScale * 10;

  const Star = (idx: number) => {
    let radius = randomFunc(unitScale, unitScale * 5),
      orbitX = randomFunc(0, width * 0.8),
      orbitY = randomFunc(0, height * 0.8),
      alpha = randomFunc(0, 2);
    const initX = orbitX;
    const initY = orbitY;
    const speed = randomFunc(1, 5);
    console.log(radius);

    return function() {
      orbitX += speed * 1.2;
      orbitY += speed;

      if (orbitX > width || orbitY > height || orbitX < 0 || orbitY < 0) {
        orbitX = initX;
        orbitY = initY;
      }

      let twinkle = randomFunc(0, 10);
      if (twinkle === 1 && alpha > 0) {
        alpha -= 0.01;
      } else if (twinkle === 2 && alpha < 1) {
        alpha += 0.01;
      }

      if (ctx) {
        ctx.globalAlpha = alpha;
        ctx.drawImage(canvas2, orbitX, orbitY, radius, radius);
      }
    };
  };

  // 一个canvas2代表一个星星区域
  const half = canvas2.width / 2;
  // 绘制放射状
  const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
  // 填充颜色渐变
  gradient2.addColorStop(0.025, '#CCC');
  gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
  gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
  gradient2.addColorStop(1, 'transparent');
  ctx2.fillStyle = gradient2;

  ctx2.beginPath();
  // arc() 方法创建弧/曲线
  ctx2.arc(half, half, half, 0, Math.PI * 2);
  ctx2.fill();

  for (var i = 0; i < maxStars; i++) {
    stars[i] = Star(i);
  }

  const animation = () => {
    if (ctx) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 0.5; //尾巴
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = 'lighter';
    }

    for (var i = 1, l = stars.length; i < l; i++) {
      stars[i]();
    }

    window.requestAnimationFrame(animation);
  };

  animation();
}
