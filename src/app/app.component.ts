import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as THREE from 'three';
declare var require: any;
import OrbitControls from 'three-orbitcontrols';
import GLTFLoader from 'three-gltf-loader';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('rendererContainer') rendererContainer: ElementRef;
  @ViewChild('wireframeButton') wireframeButton: ElementRef;

  renderer = new THREE.WebGLRenderer();
  scene;
  camera;
  mesh;
  controls;
  light;
  raycaster;
  mouse;
  sprite;
  modelLoaded;
  markMode = false;
  annotationAdded;
  annotationAddedArray = [];
  currentAnnotationCount = 1;
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x383838);
    this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
    this.light.position.set(0, 1, 0);
    this.scene.add(this.light);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.gammaOutput = true;

    const loader = new GLTFLoader();
    loader.load('../assets/models/A320/scene.gltf', (gltf) => {
      this.scene.add(gltf.scene);
      this.modelLoaded = gltf.scene;
      this.modelLoaded.traverse((child) => {
        if (child.isMesh) {
          const wireframeGeometry = new THREE.WireframeGeometry(child.geometry);
          const wireframeMaterial = new THREE.LineBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.2
          });
          const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
          child.add(wireframe);
        }
      });
    }, undefined, function (e) {
      console.error(e);
    });

    window.addEventListener('resize', () => {
      this.camera.aspect = this.rendererContainer.nativeElement.firstChild.clientWidth / this.rendererContainer.nativeElement.firstChild.clientHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight - 50);
    });
  }
  animate() {
    //this.updateAnnotationOpacity();
    window.requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
  onMark() {
    this.markMode = true;
  }
  onWireframe() {
    this.modelLoaded.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = true;
        child.material.transparent = true;
        child.material.opacity = 0.5;
      }
    });
  }
  onMaterial() {
    this.modelLoaded.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = false;
        child.material.transparent = false;
        child.material.opacity = 1;
      }
    });
  }
  onTransperant() {
    this.modelLoaded.traverse((child) => {
      if (child.isMesh) {
        child.material.wireframe = false;
        child.material.transparent = true;
        child.material.opacity = 0.3;
      }
    });
  }
  ngOnInit() {
    let count = 0;
    this.renderer.setSize(window.innerWidth, window.innerHeight - 50);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(60, this.rendererContainer.nativeElement.firstChild.clientWidth / this.rendererContainer.nativeElement.firstChild.clientHeight, 1, 80000);
    this.camera.position.set(-1000, 9000, 42000);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 20000);
    this.controls.update();
    this.animate();
    window.addEventListener('click', (event) => {
      if (this.markMode) {
        this.mouse.x = (event.clientX / this.rendererContainer.nativeElement.firstChild.clientWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / this.rendererContainer.nativeElement.firstChild.clientHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const vec = new THREE.Vector3();
        vec.unproject(this.camera);
        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length !== 0) {
          // const cubeGeometry = new THREE.BoxGeometry(250, 250, 250);
          // let mesh = new THREE.Mesh(
          //   cubeGeometry,
          //   new THREE.MeshPhongMaterial({
          //     color: 0xcc0000,
          //     emissive: 0x000000,
          //     side: THREE.DoubleSide,
          //     shading: THREE.FlatShading
          //   })
          // );
          // const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, -1).unproject(this.camera);
          let canvas: any = document.getElementById("number");
          const ctx = canvas.getContext('2d');
          const x = 32;
          const y = 32;
          const radius = 30;
          const startAngle = 0;
          const endAngle = Math.PI * 2;

          ctx.fillStyle = 'rgb(0, 0, 0)';
          ctx.beginPath();
          ctx.arc(x, y, radius, startAngle, endAngle);
          ctx.fill();

          ctx.strokeStyle = 'rgb(255, 255, 255)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, radius, startAngle, endAngle);
          ctx.stroke();

          ctx.fillStyle = 'rgb(255, 255, 255)';
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(this.currentAnnotationCount, x, y);
          const numberTexture = new THREE.CanvasTexture(
            document.querySelector("#number")
          );

          const spriteMaterial = new THREE.SpriteMaterial({
            map: numberTexture,
            depthTest: false,
            depthWrite: false,
            sizeAttenuation: false
          });

          let annotationAdded = new THREE.Sprite(spriteMaterial);
          //sprite.position.set(250, 250, 250);
          annotationAdded.scale.set(0.03, 0.03, 1);

          annotationAdded.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);
          this.scene.add(annotationAdded);
          this.annotationAddedArray.push(annotationAdded);
          this.currentAnnotationCount++;
          this.markMode = false;
          this.renderer.render(this.scene, this.camera);
        }
      };
    });

  }

  onWindowResize() {
    this.camera.aspect = this.rendererContainer.nativeElement.firstChild.clientWidth / this.rendererContainer.nativeElement.firstChild.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight - 50);
  }

  updateAnnotationOpacity() {
    if (this.modelLoaded && this.annotationAddedArray.length !== 0) {
      this.annotationAddedArray.forEach(annotation => {
        // const meshDistance = this.camera.position.distanceTo(this.modelLoaded.position);
        // const spriteDistance = this.camera.position.distanceTo(annotation.position);
        // const spriteBehindObject = spriteDistance > meshDistance;
        // annotation.material.opacity = spriteBehindObject ? 0 : 1;
        var scaleVector = new THREE.Vector3();
        var scaleFactor = 15;
        var scale = scaleVector.subVectors(annotation.position, this.camera.position).length() / (scaleFactor / this.camera.zoom);
        annotation.scale.set(scale, scale, 1);
      });
    }

  }
}
