export function onMouseMoveListener(event: any) {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const anchor = document.getElementById('anchor');
  const rekt = anchor?.getBoundingClientRect() as DOMRect;
  if (rekt) {
    const anchorX = rekt.left + rekt.width / 2;
    const anchorY = rekt.top + rekt.height / 2;

    const angleDeg = angle(mouseX, mouseY, anchorX, anchorY);
    const eyes = document.querySelectorAll('.eye');
    eyes.forEach((eye: any) => {
      eye.style.transform = `rotate(${90 + angleDeg}deg)`;
    });
  }
}

export function angle(cx: number, cy: number, ex: number, ey: number): number {
  const dy = ey - cy;
  const dx = ex - cx;
  const rad = Math.atan2(dy, dx);
  const deg = (rad * 180) / Math.PI;

  return deg;
}
