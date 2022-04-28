// Reed shepp path planner
const sum_abs = (array) => array.map(Math.abs).reduce((partialSum, a) => partialSum + a, 0);

function straight_left_straight(x, y, phi)
{
    if (y > 0.0 && 0.0 < phi < Math.pi * 0.99) {
        let xd = -y / Math.tan(phi) + x;
        let t = xd - Math.tan(phi / 2.0);
        let u = phi;
        let v = Math.sqrt((x - xd) ** 2 + y ** 2) - Math.tan(phi / 2.0);
        return [true, t, u, v];
    }
    else if (y < 0.0 < phi < Math.pi * 0.99) {
        let xd = -y / Math.tan(phi) + x;
        let t = xd - Math.tan(phi / 2.0);
        let u = phi;
        let v = -Math.sqrt((x - xd) ** 2 + y ** 2) - Math.tan(phi / 2.0);
        return [true, t, u, v];
    }
    return [false, 0.0, 0.0, 0.0];
}
function set_path(paths, lengths, ctypes, step_size) {
    let path = Path();
    path.ctypes = ctypes;
    path.lengths = lengths;
    path.L = sum_abs(lengths);

    for (let i = 0; i < paths.length; i++) {
        let i_path = paths[i];
        let type_is_same = (i_path.ctypes == path.ctypes);
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
    let { flag, t, u, v } = straight_left_straight(x, y, phi);
    if (flag) {
        paths = set_path(paths, [t, u, v], ["S", "L", "S"], step_size);
    }
    flag, t, u, v = straight_left_straight(x, -y, -phi);
    if (flag) {
        paths = set_path(paths, [t, u, v], ["S", "R", "S"], step_size);
    }
    return paths
}

function reeds_shepp_path_planning(
    start_pose, end_pose, curvature, stepsize) {
    let step_size = 0.2
    let dx = start_pose.x - end_pose.x;
    let dy = start_pose.y - end_pose.y;
    let dth = start_pose.yaw - end_pose.yaw;

    let c = Math.cos(start_pose.yaw);
    let s = Math.sin(start_pose.yaw);
    let x = (c * dx + s * dy) * curvature;
    let y = (-s * dx + c * dy) * curvature;

    let paths = [];
    paths = straight_curve_straight(x, y, dth, paths, step_size);
}