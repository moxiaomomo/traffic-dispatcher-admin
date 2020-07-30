import { BoxGeometry, Mesh, MeshPhongMaterial, Vector3 } from 'three';

export class BasicGeometry {
    public static genBoxGeometry(size: Vector3) {
        const geometry = new BoxGeometry(size.x, size.y, size.z);
        // const material = new MeshBasicMaterial({ color: 0x6584d8 });
        const material = new MeshPhongMaterial({
            color: 0x996633,
            specular: 0x050505,
            shininess: 100,
        });
        const cube = new Mesh(geometry, material);
        cube.position.set(0, 1, 0);
        return cube;
    }
}
