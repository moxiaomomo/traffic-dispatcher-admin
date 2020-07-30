import {
  Scene,
  PerspectiveCamera,
  Color,
  WebGLRenderer,
  LinearToneMapping,
  AmbientLight,
  Vector3,
  Group,
  PMREMGenerator,
  UnsignedByteType,
  HemisphereLight,
  Raycaster,
  Object3D,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'; // 控制器
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader'; // gltf文件加载
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { BasicGeometry } from '@/utils/basic.geometry';
import * as Utils from '@/utils/utils';

export default class Scene3D {
  private threeContainer!: HTMLElement;
  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private raycaster!: Raycaster;
  private loader!: GLTFLoader;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private tObjects!: Map<string, Group>;
  private direction = -1;
  private agvProcessing = false;

  constructor() {
    this.raycaster = new Raycaster();
    this.tObjects = new Map<string, Group>();
  }

  public initScene(containerID: string): void {
    this._initScene(containerID);
    this.loadModel();
    this.loadHDR();
    this.initEvent();
  }

  public startAnimation() {
    const animation = () => {
      if (this.renderer) {
        this.renderer.render(this.scene, this.camera);
      }
      if (this.controls) {
        this.controls.update();
      }
      this.agvMoving();
      requestAnimationFrame(animation);
    };
    animation();
  }

  public setAgvState(processing: boolean) {
    this.agvProcessing = processing;
  }

  private _initScene(containerID: string) {
    this.threeContainer = document.getElementById(containerID) as HTMLElement;

    this.scene = new Scene();
    this.scene.background = new Color(0xccccee);

    //环境光 / 平行光
    // const dlight = new DirectionalLight(0xdfccbb, 1);
    // dlight.position.set(0, 1, 0);
    // this.scene.add(dlight);
    this.scene.add(new AmbientLight(0xffffff, 1));
    const hemiLight = new HemisphereLight(0xffffff, 0x000000, 1);
    hemiLight.position.set(0, 100, 0);
    this.scene.add(hemiLight);

    // 相机
    this.camera = new PerspectiveCamera(
      45,
      this.threeContainer.clientWidth / this.threeContainer.clientHeight,
      0.1,
      2500
    );
    this.camera.position.copy(new Vector3(-100, 50, 0));
    // this.camera.lookAt(new Vector3(100, 0, 100));
    this.scene.add(this.camera);

    // 渲染器
    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.context.getShaderInfoLog = () => '';
    this.renderer.setSize(
      this.threeContainer.scrollWidth,
      this.threeContainer.scrollHeight
    );
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.toneMapping = LinearToneMapping;
    this.renderer.toneMappingExposure = 1;

    // 相机控件
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 800;
    this.controls.target.copy(new Vector3(100, 0, 50));

    this.threeContainer.appendChild(this.renderer.domElement);
  }

  private initEvent() {
    this.threeContainer.addEventListener('click', (evt) => {
      const maskdiv = document.getElementById('maskdiv');
      this.onRayEvent(evt);
    });
  }

  private loadModel() {
    this.loader = new GLTFLoader();
    this.loader.load('/model/agv002.glb', (obj: GLTF) => {
      obj.scene.name = 'gdgiri_agv002';
      this.scene.add(obj.scene);
      obj.scene.scale.set(2, 2, 2);
      obj.scene.position.set(60, 0.3, 30);
      this.tObjects.set(obj.scene.name, obj.scene);
    });
    this.loader.load('/model/house002.glb', (obj: GLTF) => {
      obj.scene.name = 'gdgiri_house002';
      this.scene.add(obj.scene);
      this.tObjects.set(obj.scene.name, obj.scene);
    });
    this.loader.load('/model/haballoon.glb', (obj: GLTF) => {
      obj.scene.name = 'gdgiri_haballoon';
      obj.scene.scale.set(10, 10, 10);
      obj.scene.position.set(0, 0, 300);
      this.scene.add(obj.scene);
      this.tObjects.set(obj.scene.name, obj.scene);
    });
    this.loader.load('/model/haballoon002.glb', (obj: GLTF) => {
      obj.scene.name = 'gdgiri_haballoon002';
      obj.scene.scale.set(0.2, 0.2, 0.2);
      obj.scene.position.set(0, 30, 300);
      this.scene.add(obj.scene);
      this.tObjects.set(obj.scene.name, obj.scene);
    });
  }

  private loadHDR() {
    const pmremGenerator = new PMREMGenerator(this.renderer); // 使用hdr作为背景色
    pmremGenerator.compileEquirectangularShader();

    const scene = this.scene;
    new RGBELoader()
      .setDataType(UnsignedByteType)
      .load('/env/railway_bridge_02_1k.hdr', function(texture) {
        const envMap = pmremGenerator.fromEquirectangular(texture).texture;
        // envMap.isPmremTexture = true;
        pmremGenerator.dispose();

        scene.environment = envMap; // 给场景添加环境光效果
        // scene.background = envMap; // 给场景添加背景图
      });
  }

  public onRayEvent(evt: MouseEvent) {
    const standardVector = this.transformMousePosToStdPos(
      evt.clientX,
      evt.clientY
    );

    // //标准设备坐标转世界坐标
    // const worldVector = standardVector.unproject(this.camera);
    // const ray = worldVector.sub(this.camera.position).normalize();

    //创建射线投射器对象
    this.raycaster = new Raycaster();
    this.raycaster.setFromCamera(standardVector, this.camera);
    //返回射线选中的对象
    const intersects = this.raycaster.intersectObjects([this.scene], true);

    if (intersects.length > 0) {
      // console.log(intersects[0]);
      const point = intersects[0].point; //射线在模型表面拾取的点坐标
      const mesh = intersects[0].object;
      const rootParent = Utils.getRootParent(mesh);
      if (rootParent.name.startsWith('gdgiri_haballoon')) {
        const pLocal = point.sub(rootParent.position);
        const obj = new Object3D();
        obj.add(BasicGeometry.genBoxGeometry(new Vector3(1, 1, 1)));

        obj.scale.copy(new Vector3(1, 1, 1).divide(rootParent.scale));
        obj.position.copy(pLocal.divide(rootParent.scale));
        rootParent.add(obj);
      }
    }
  }

  private transformMousePosToStdPos(mouseX: number, mouseY: number) {
    const x = mouseX;
    const y = mouseY;
    const rect = this.threeContainer.getBoundingClientRect();
    const newX = ((x - rect.left) / this.threeContainer.clientWidth) * 2 - 1;
    const newY = -((y - rect.top) / this.threeContainer.clientHeight) * 2 + 1;
    return new Vector3(newX, newY, 0.5);
  }

  private agvMoving() {
    if (!this.tObjects || !this.agvProcessing) {
      return;
    }
    const agv = this.tObjects.get('gdgiri_agv002');
    if (agv) {
      if (agv.position.x < -30) {
        this.direction = 1;
      } else if (agv.position.x > 30) {
        this.direction = -1;
      }
      agv.position.x += 0.1 * this.direction;
    }
  }
}
