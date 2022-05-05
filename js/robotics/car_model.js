
// utils
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function normalizeAngle(theta) {
    while (theta > Math.PI) {
        theta -= 2 * Math.PI;
    }
    while (theta < -Math.PI) {
        theta += 2 * Math.PI;
    }
    return theta;
}

function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

// like numpy.arange
function arange(start, stop, step, endpoint = false) {
    var num = Math.ceil(Math.abs(start - stop) / Math.abs(step));
    arr = Array.from({ length: num }, (_, i) => start + step * i);
    if (endpoint && Math.abs(arr[arr.length-1] - stop) > (step/2.0) ) {
        arr.push(stop);
    }
    return arr;
}

function linspace(start, stop, num, endpoint = false) {
    const div = endpoint ? (num - 1) : num;
    const step = (stop - start) / div;
    return Array.from({length: num}, (_, i) => start + step * i);
}

// classes
class Car {
    constructor(x, y, color) {
        this.car_width = 25;
        this.car_length = 50;
        this.wheel_base = 30;
        this.max_speed = 2.0;
        this.max_steer = 0.5; //~30 degrees

        this.x = x;
        this.y = y;
        this.yaw = 0;
        this.speed = 0;
        this.color = color;
        this.render();
    }
    reset_speed()
    {
        this.speed = 0;
    }

    update(pedal, steer, dt) {
        steer = clamp(steer, -this.max_steer, this.max_steer);
        this.x += this.speed * Math.cos(this.yaw) * dt;
        this.y += this.speed * Math.sin(this.yaw) * dt;
        this.yaw += this.speed / this.wheel_base * Math.tan(steer) * dt;
        // this.yaw = normalizeAngle(this.yaw);
        this.speed += pedal * dt;
        this.speed = clamp(this.speed, -this.max_speed, this.max_speed);
    }
    
    render() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 2;
        //transformation
        ctx.translate(this.x, this.y);
        ctx.rotate(this.yaw);
        ctx.translate(-this.x, -this.y)
        ctx.rect(this.x - this.car_length/2, this.y - this.car_width/2, this.car_length, this.car_width);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.stroke();
        ctx.restore();

    }
};  

function canvas_arrow(context, fromx, fromy, tox, toy) {
    let headlen = 10; // length of head in pixels
    let arrow_len = 50;
    let dx = tox - fromx;
    let dy = toy - fromy;
    let angle = Math.atan2(dy, dx);
    let dist = Math.hypot(dx, dy);
    arrow_len = Math.min(dist, arrow_len);
    let tx = arrow_len * Math.cos(angle) + fromx;
    let ty = arrow_len * Math.sin(angle) + fromy;
    context.beginPath(); // begin
    context.lineCap = 'round';
    context.strokeStyle = 'red';
    context.moveTo(fromx, fromy);
    context.lineTo(tx, ty);
    context.lineTo(tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tx, ty);
    context.lineTo(tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}