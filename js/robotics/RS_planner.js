// Reed shepp path planner 
// inspired by https://github.com/AtsushiSakai/PythonRobotics/tree/master/PathPlanning/ReedsSheppPath

const sum_abs = (array) => array.map(Math.abs).reduce((partialSum, a) => partialSum + a, 0);
const polar = (x, y) => [Math.hypot(x, y), Math.atan2(y, x)];

function straight_left_straight(x, y, phi){
    if (y > 0.0 && 0.0 < phi && phi < Math.PI * 0.99) {
        let xd = -y / Math.tan(phi) + x;
        let t = xd - Math.tan(phi / 2.0);
        let u = phi;
        let v = Math.sqrt((x - xd) ** 2 + y ** 2) - Math.tan(phi / 2.0);
        return [true, t, u, v];
    }
    else if (y < 0.0 && 0.0 < phi  && phi < Math.PI * 0.99) {
        let xd = -y / Math.tan(phi) + x;
        let t = xd - Math.tan(phi / 2.0);
        let u = phi;
        let v = -Math.sqrt((x - xd) ** 2 + y ** 2) - Math.tan(phi / 2.0);
        return [true, t, u, v];
    }
    return [false, 0.0, 0.0, 0.0];
}

function left_straight_left(x, y, phi) {
    var [u, t] = polar(x - Math.sin(phi), y - 1.0 + Math.cos(phi));
    if (t >= 0.0) {
        var v = normalizeAngle(phi - t);
        if (v >= 0.0) {
            return [true, t, u, v];
        }
    }
    return [false, 0.0, 0.0, 0.0];
}

function left_straight_right(x, y, phi) {
    var [u1, t1] = polar(x + Math.sin(phi), y - 1.0 - Math.cos(phi));
    u1 = u1 ** 2;
    if (u1 >= 4.0) {
        var u = Math.sqrt(u1 - 4.0);
        var theta = Math.atan2(2.0, u);
        var t = normalizeAngle(t1 + theta);
        var v = normalizeAngle(t - phi);
        if (t >= 0.0 && v >= 0.0) {
            return [true, t, u, v];
        }
    }
    return [false, 0.0, 0.0, 0.0];
}

function left_right_left(x, y, phi) {
    var [u1, t1] = polar(x - Math.sin(phi), y - 1.0 + Math.cos(phi))
    if (u1 <= 4.0) {
        var u = -2.0 * Math.asin(0.25 * u1);
        var t = normalizeAngle(t1 + 0.5 * u + Math.PI);
        var v = normalizeAngle(phi - t + u);

        if (t >= 0.0 && 0.0 >= u) {
            return [true, t, u, v];
        }
    }
    return [false, 0.0, 0.0, 0.0];
}

function set_path(paths, lengths, ctypes, step_size) {
    let path = new Path();
    path.ctypes = ctypes;
    path.lengths = lengths;
    path.L = sum_abs(lengths);

    for (let i = 0; i < paths.length; i++) {
        let i_path = paths[i];
        let type_is_same = arrayEquals(i_path.ctypes, path.ctypes);
        let length_is_close = (sum_abs(i_path.lengths) - path.L) <= step_size;
        if (type_is_same && length_is_close) {
            return paths;
        }
    }
    if (path.L <= step_size) {
        return paths;
    }
    paths.push(path);
    return paths;
}

function straight_curve_straight(x, y, phi, paths, step_size) {
    var [flag, t, u, v] = straight_left_straight(x, y, phi);
    if (flag) {
        paths = set_path(paths, [t, u, v], ["S", "L", "S"], step_size);
    }

    var [flag, t, u, v] = straight_left_straight(x, -y, -phi)
    if (flag) {
        paths = set_path(paths, [t, u, v], ["S", "R", "S"], step_size);
    }
    return paths
}


function curve_straight_curve(x, y, phi, paths, step_size) {
    var [flag, t, u, v] = left_straight_left(x, y, phi);
    if(flag){
        paths = set_path(paths, [t, u, v], ["L", "S", "L"], step_size);
    }
    var [flag, t, u, v] = left_straight_left(-x, y, -phi);
    
    if(flag){
        paths = set_path(paths, [-t, -u, -v], ["L", "S", "L"], step_size);
    }
    var [flag, t, u, v] = left_straight_left(x, -y, -phi);
    if(flag){
        paths = set_path(paths, [t, u, v], ["R", "S", "R"], step_size);
    }
    var [flag, t, u, v] = left_straight_left(-x, -y, phi);
    if(flag){
        paths = set_path(paths, [-t, -u, -v], ["R", "S", "R"], step_size);
    }
    var [flag, t, u, v] = left_straight_right(x, y, phi);
    if(flag){
        paths = set_path(paths, [t, u, v], ["L", "S", "R"], step_size);
    }
    var [flag, t, u, v] = left_straight_right(-x, y, -phi);
    if(flag){
        paths = set_path(paths, [-t, -u, -v], ["L", "S", "R"], step_size);
    }
    var [flag, t, u, v] = left_straight_right(x, -y, -phi);
    if(flag){
        paths = set_path(paths, [t, u, v], ["R", "S", "L"], step_size);
    }
    var [flag, t, u, v] = left_straight_right(-x, -y, phi);
    if(flag){
        paths = set_path(paths, [-t, -u, -v], ["R", "S", "L"], step_size);
    }
    
    return paths
}

function curve_curve_curve(x, y, phi, paths, step_size) {
    var [flag, t, u, v] = left_right_left(x, y, phi);
    if (flag){
        paths = set_path(paths, [t, u, v], ["L", "R", "L"], step_size);
    }
    var [flag, t, u, v] = left_right_left(-x, y, -phi);
    if (flag){
        paths = set_path(paths, [-t, -u, -v], ["L", "R", "L"], step_size);
    }
    var [flag, t, u, v] = left_right_left(x, -y, -phi);
    if (flag){
        paths = set_path(paths, [t, u, v], ["R", "L", "R"], step_size);
    }
    var [flag, t, u, v] = left_right_left(-x, -y, phi);
    if (flag){
        paths = set_path(paths, [-t, -u, -v], ["R", "L", "R"], step_size);
    }
    // backwards
    var xb = x * Math.cos(phi) + y * Math.sin(phi);
    var yb = x * Math.sin(phi) - y * Math.cos(phi);

    var [flag, t, u, v] = left_right_left(xb, yb, phi)
    if (flag){
        paths = set_path(paths, [v, u, t], ["L", "R", "L"], step_size)
    }
    var [flag, t, u, v] = left_right_left(-xb, yb, -phi)
    if (flag){
        paths = set_path(paths, [-v, -u, -t], ["L", "R", "L"], step_size)
    }
    var [flag, t, u, v] = left_right_left(xb, -yb, -phi)
    if (flag){
        paths = set_path(paths, [v, u, t], ["R", "L", "R"], step_size)
    }
    var [flag, t, u, v] = left_right_left(-xb, -yb, phi)
    if (flag){
        paths = set_path(paths, [-v, -u, -t], ["R", "L", "R"], step_size)
    }
    return paths
}

function calc_interpolate_dists_list(lengths, step_size) {
    var interpolate_dists_list = []
    for (let i in lengths) {
        let length = lengths[i];
        let d_dist = ((length >= 0.0) ? step_size : -step_size);
        let interp_dists = arange(0.0, length, d_dist, true);
        interpolate_dists_list.push(interp_dists)
    }
    return interpolate_dists_list
}

function interpolate(dist, length, mode, max_curvature, origin_x, origin_y, origin_yaw) {
    var [x, y, yaw] = [0.0, 0.0, 0.0];
    if (mode == "S") {
        x = origin_x + dist / max_curvature * Math.cos(origin_yaw);
        y = origin_y + dist / max_curvature * Math.sin(origin_yaw);
        yaw = origin_yaw;
    }
    else {
        // curve
        var ldx = Math.sin(dist) / max_curvature;
        var ldy = 0.0;
        var yaw = 0.0;
        if (mode == "L") {
            // left turn
            ldy = (1.0 - Math.cos(dist)) / max_curvature;
            yaw = origin_yaw + dist;
        }
        else if (mode == "R") {
            // right turn
            ldy = (1.0 - Math.cos(dist)) / -max_curvature;
            yaw = origin_yaw - dist;
        }
        var gdx = Math.cos(-origin_yaw) * ldx + Math.sin(-origin_yaw) * ldy;
        var gdy = -Math.sin(-origin_yaw) * ldx + Math.cos(-origin_yaw) * ldy;
        x = origin_x + gdx;
        y = origin_y + gdy;
    }
    var direction = ((length > 0.0) ? 1 : -1);
    
    return [x, y, yaw, direction]    
}

function generate_local_course(lengths, modes, max_curvature, step_size) {
    var interpolate_dists_list = calc_interpolate_dists_list(lengths, step_size)
    var [origin_x, origin_y, origin_yaw] = [0.0, 0.0, 0.0];
    var [xs, ys, yaws, directions] = [[], [], [], []];
    for (let i in interpolate_dists_list) {
        var interp_dists = interpolate_dists_list[i];
        var mode = modes[i];
        var length = lengths[i];
        for (let j in interp_dists) {
            var dist = interp_dists[j];
            var [x, y, yaw, direction] = interpolate(dist, length, mode,
                max_curvature, origin_x,
                origin_y, origin_yaw)
            console.log([mode, x, y, yaw, direction])
            xs.push(x);
            ys.push(y);
            yaws.push(yaw);
            directions.push(direction);
        }
        origin_x = xs[xs.length-1];
        origin_y = ys[ys.length-1];
        origin_yaw = yaws[yaws.length-1];
    }
    return [xs, ys, yaws, directions];

}
function reeds_shepp_path_planning(
    start_pose, end_pose, curvature, step_size) {
    let dx = end_pose.x - start_pose.x;
    let dy = end_pose.y - start_pose.y;
    let dth = end_pose.yaw - start_pose.yaw;

    let c = Math.cos(start_pose.yaw);
    let s = Math.sin(start_pose.yaw);
    let x = (c * dx + s * dy) * curvature;
    let y = (-s * dx + c * dy) * curvature;

    let paths = [];
    paths = straight_curve_straight(x, y, dth, paths, step_size);
    paths = curve_straight_curve(x, y, dth, paths, step_size);
    paths = curve_curve_curve(x, y, dth, paths, step_size);

    for (let i in paths) {
        let path = paths[i];

        var [xs, ys, yaws, directions] = generate_local_course(path.lengths,
            path.ctypes, curvature,
            step_size * curvature)
        break

    //     // convert global coordinate
    //     path.x = [math.cos(-q0[2]) * ix + math.sin(-q0[2]) * iy + q0[0] for
    //         (ix, iy) in zip(xs, ys)]
    //     path.y = [-math.sin(-q0[2]) * ix + math.cos(-q0[2]) * iy + q0[1] for
    //         (ix, iy) in zip(xs, ys)]
    //     path.yaw = [pi_2_pi(yaw + q0[2]) for yaw in yaws]
    //     path.directions = directions
    //     path.lengths = [length / maxc for length in path.lengths]
    //     path.L = path.L / maxc
    }
    return paths;
}