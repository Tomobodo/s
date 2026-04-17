export class GameObject {
  draw(buf, width) {}
  hitTest(x, y) { return false; }
  onUpdate(dt) {}
  onClick(x, y, v, sid) {}
  onMessage(x, y, v, sid) {}
  onAdd(scene) {}
  onRemove(scene) {}
}
