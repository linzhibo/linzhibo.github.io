function Pose2D(x, y, yaw) {
    this.x = x || 0.0;
    this.y = y || 0.0;
    this.yaw = yaw || 0.0;
}
  
function Vector2D(x, y) {
    this.x = x || 0.0;
    this.y = y || 0.0;
}

class Path{
    constructor() {
        // # course segment length  (negative value is backward segment)
        this.lengths = []
        // # course segment type char ("S": straight, "L": left, "R": right)
        this.ctypes = []
        this.L = 0.0 //Total lengths of the path
        this.x = [] //x positions
        this.y = [] //y positions
        this.yaw = [] //orientations [rad]
        this.directions = [] //directions (1:forward, -1:backward)
    }
}