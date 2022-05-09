
// GLOBAL variables 
var canvas = document.getElementById('canvas');

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
// canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();

var car = new Car(ctx, 50, 50, "gray");
var arrow_head_pose = new Pose2D(0, 0, 0);
var animation_id = -1;
var goal_pose = new Pose2D(0,0,0);
var start_pose = new Pose2D(0,0,0);
var path = new Path(start_pose, goal_pose, arrow_head_pose);
var path_tracker = new PurePursuit();

document.addEventListener('mousedown', setGoalPosition);
document.addEventListener('mouseup', path_plan);
document.addEventListener('mousemove', draw);

function setGoalPosition(e) {
  goal_pose.x = e.clientX;
  goal_pose.y = e.clientY;
}
function setStartPosition(x, y, yaw) {
  start_pose.x = x;
  start_pose.y = y;
  start_pose.yaw = yaw;
}
function setGoalYaw(from_p, to_p){
  let dx = to_p.x - from_p.x;
  let dy = to_p.y - from_p.y;
  let angle = Math.atan2(dy, dx);
  goal_pose.yaw = angle;
}

// new position from mouse event
function setPosition(e) {
  arrow_head_pose.x = e.clientX;
  arrow_head_pose.y = e.clientY;
}

function path_plan(e) {
  if (mouse_outside_canvas(e)) {
    return;
  }
  path_tracker.reset();
  setStartPosition(car.x, car.y, car.yaw);
  setGoalYaw(goal_pose, arrow_head_pose);
  let car_curvature = Math.tan(car.max_steer) / car.wheel_base
  path = reeds_shepp_path_planning(start_pose, goal_pose, car_curvature, 1);
  if (path == undefined) {
    console.log("failed to plan" );
    return;
  }
  if (animation_id != -1) {
    window.cancelAnimationFrame(animation_id);
  }
  
  track();
}

function track() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let arrived = false;
  [pedal, steer, arrived] = path_tracker.compute_cmd(car, path);
  car.update(pedal, steer, 0.1, arrived);
  car.render();
  path.render();
  canvas_arrow(ctx, goal_pose.x, goal_pose.y, arrow_head_pose.x, arrow_head_pose.y);
  canvas_cross(ctx, path.x[path_tracker.current_idx], path.y[path_tracker.current_idx]);
  animation_id = window.requestAnimationFrame(track);
}

// resize canvas
function resize() {
  ctx.canvas.width = window.innerWidth;
  // ctx.canvas.height = window.innerHeight;
}

function mouse_outside_canvas(e) {
  return e.clientY > ctx.canvas.height || e.clientX > ctx.canvas.width || goal_pose.y > ctx.canvas.height;
}

function draw(e) {
  if (e.buttons !== 1 || mouse_outside_canvas(e)) { return; }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.render();
  car.reset_speed();
  car.reset_history_points();
  canvas_arrow(ctx, goal_pose.x, goal_pose.y, arrow_head_pose.x, arrow_head_pose.y);
  setPosition(e);
}

function get_speed_input() {
  car.set_max_speed(document.getElementById('car_speed').value);
}