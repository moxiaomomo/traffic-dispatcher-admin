import { Scene, Object3D, Vector3, Euler, Color } from 'three';

export function toFixed(x: number, bitNum: number) {
    const temp = Math.pow(10, bitNum);
    if (temp < 0) {
        return x;
    }
    return Math.round(x * temp) / temp;
}

export function toFixedVector3(vec: Vector3 | Euler, bitNum: number): Vector3 {
    const temp = Math.pow(10, bitNum);
    if (temp < 0) {
        return new Vector3(0, 0, 0);
    }

    if (vec instanceof Vector3) {
        vec.x = Math.round(vec.x * temp) / temp;
        vec.y = Math.round(vec.y * temp) / temp;
        vec.z = Math.round(vec.z * temp) / temp;

        // TODO: 范围约束
        const max = 300,
            min = -300;
        if (vec.x > max) {
            vec.x = max;
        } else if (vec.x < min) {
            vec.x = min;
        }
        if (vec.y > max) {
            vec.y = max;
        } else if (vec.y < min) {
            vec.y = min;
        }
        if (vec.z > max) {
            vec.z = max;
        } else if (vec.z < min) {
            vec.z = min;
        }
        return vec;
    } else {
        const vnew = new Vector3(vec.x, vec.y, vec.z);
        vnew.x = Math.round(vnew.x * temp) / temp;
        vnew.y = Math.round(vnew.y * temp) / temp;
        vnew.z = Math.round(vnew.z * temp) / temp;
        return vnew;
    }
}

export function toFixedEuler(vec: Vector3 | Euler, bitNum: number): Euler {
    const nVec = toFixedVector3(vec, bitNum);
    if (vec instanceof Vector3) {
        return new Euler(nVec.x, nVec.y, nVec.z);
    } else {
        return new Euler(nVec.x, nVec.y, nVec.z, (vec as Euler).order);
    }
}

// 全局唯一ID生成器
export function GlobalUniqID() {
    const ts = new Date().getTime(); // 时间戳，精确到毫秒
    const rStr = Math.floor(Math.random() * 1000 + 1); // 3位随机数
    const uid = `${ts}${rStr}`;
    return uid;
}

export function getRootParent(obj: Object3D): Object3D {
    if (obj.parent == null || obj.name.startsWith('gdgiri_')) {
        return obj;
    }
    return getRootParent(obj.parent);
}
