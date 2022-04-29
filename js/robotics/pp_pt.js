
var canvas = document.getElementById('canvas');
// document.body.appendChild(canvas);

// some hotfixes... ( ≖_≖)
document.body.style.margin = 0;
canvas.style.position = 'fixed';

// get canvas 2D context and set him correct size
var ctx = canvas.getContext('2d');
resize();

var car = new Car(50, 50, "gray");
var arrow_head_pose = new Pose2D(0,0,0);
var goal_pose = new Pose2D(0,0,0);
var start_pose = new Pose2D(0,0,0);
var path = new Path(start_pose, goal_pose, arrow_head_pose);

window.addEventListener('resize', resize);
document.addEventListener('mousedown', setGoalPosition);
document.addEventListener('mouseenter', setPosition);
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

function draw_path()
{
  ctx.beginPath();
  ctx.strokeStyle = 'green';
  ctx.moveTo(start_pose.x, start_pose.y);
  ctx.lineTo(goal_pose.x, goal_pose.y);
  ctx.stroke();
}

function path_plan(e) {
  setStartPosition(car.x, car.y, car.yaw);
  setGoalYaw(goal_pose, arrow_head_pose);
  // let paths = reeds_shepp_path_planning(
  //   start_pose, goal_pose, 0.1, 0.05)
  let pahts = reeds_shepp_path_planning(
    new Pose2D(-1.0, -4.0, -0.35), new Pose2D(5.0, 5.0, 0.436), 0.1, 0.05
  )
  track();
}

function track(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // car.update(0.5, 0.1, 0.1);
  car.render();
  canvas_arrow(ctx, goal_pose.x, goal_pose.y, arrow_head_pose.x, arrow_head_pose.y);
  // path.render();
  raf = window.requestAnimationFrame(track);
}


//#############################################################
// resize canvas
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}

function draw(e) {
  if (e.buttons !== 1) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.render();
  car.reset_speed();
  canvas_arrow(ctx, goal_pose.x, goal_pose.y, arrow_head_pose.x, arrow_head_pose.y);
  setPosition(e);
}