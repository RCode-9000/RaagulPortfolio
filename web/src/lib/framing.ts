import * as THREE from "three";

// Keeps the camera from ever seeing outside the room. A camera pose is
// "safe" when rays through the frame's corners, edge midpoints and centre all hit the room
// shell (walls + floor). For any orbit angle we search for the farthest safe distance.

const SAMPLES: [number, number][] = [
  [-1, -1], [1, -1], [-1, 1], [1, 1], [0, 1], [0, -1], [-1, 0], [1, 0], [0, 0],
].map(([x, y]) => [x * 0.995, y * 0.995]);

const ray = new THREE.Raycaster();
const probe = new THREE.PerspectiveCamera();
const tmp = new THREE.Vector3();
const ndc = new THREE.Vector2();

/** Spherical offset (camera-controls convention: azimuth from +Z toward +X, polar from +Y). */
export function offset(azimuth: number, polar: number, dist: number, out = new THREE.Vector3()) {
  return out.setFromSphericalCoords(dist, polar, azimuth);
}

export function poseIsSafe(shell: THREE.Object3D, eye: THREE.Vector3, target: THREE.Vector3, fov: number, aspect: number) {
  probe.fov = fov;
  probe.aspect = aspect;
  probe.near = 0.01;
  probe.far = 100;
  probe.position.copy(eye);
  probe.lookAt(target);
  probe.updateProjectionMatrix();
  probe.updateMatrixWorld(true);
  for (const [x, y] of SAMPLES) {
    ray.setFromCamera(ndc.set(x, y), probe);
    if (ray.intersectObject(shell, true).length === 0) return false;
  }
  return true;
}

/** Farthest distance in [lo, hi] at which the pose is safe (binary search; lo if none is). */
export function maxSafeDistance(
  shell: THREE.Object3D, target: THREE.Vector3, azimuth: number, polar: number,
  fov: number, aspect: number, lo: number, hi: number,
) {
  if (poseIsSafe(shell, tmp.copy(target).add(offset(azimuth, polar, hi)), target, fov, aspect)) return hi;
  let a = lo, b = hi;
  for (let i = 0; i < 9; i++) {
    const m = (a + b) / 2;
    if (poseIsSafe(shell, tmp.copy(target).add(offset(azimuth, polar, m)), target, fov, aspect)) a = m;
    else b = m;
  }
  return a;
}

/** Safe-distance lookup over the allowed orbit range, sampled on a grid (conservative between samples). */
export class SafeDistanceTable {
  private grid: number[][] = [];
  constructor(
    shell: THREE.Object3D, target: THREE.Vector3,
    private az0: number, private az1: number, private pol0: number, private pol1: number,
    fov: number, aspect: number, lo: number, hi: number, private n = 9,
  ) {
    for (let i = 0; i <= n; i++) {
      const row: number[] = [];
      for (let j = 0; j <= n; j++) {
        const az = az0 + ((az1 - az0) * i) / n;
        const pol = pol0 + ((pol1 - pol0) * j) / n;
        row.push(maxSafeDistance(shell, target, az, pol, fov, aspect, lo, hi));
      }
      this.grid.push(row);
    }
  }

  at(azimuth: number, polar: number) {
    const u = THREE.MathUtils.clamp((azimuth - this.az0) / (this.az1 - this.az0), 0, 1) * this.n;
    const v = THREE.MathUtils.clamp((polar - this.pol0) / (this.pol1 - this.pol0), 0, 1) * this.n;
    const i = Math.min(Math.floor(u), this.n - 1), j = Math.min(Math.floor(v), this.n - 1);
    const g = this.grid;
    // conservative: the smallest of the four surrounding samples, so we never overshoot into the void
    return Math.min(g[i][j], g[i + 1][j], g[i][j + 1], g[i + 1][j + 1]) * 0.995;
  }
}
