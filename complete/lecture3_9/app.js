import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { Stats } from '../../libs/stats.module.js';
import { ARButton } from '../../libs/ARButton.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );

        this.clock = new THREE.Clock();

		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );

		this.scene = new THREE.Scene();

		this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

        const light = new THREE.DirectionalLight( 0xffffff );
        light.position.set( 1, 1, 1 ).normalize();
		this.scene.add( light );

		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;

		container.appendChild( this.renderer.domElement );
		this.loadGLTF();

		loadGLTF(){
				const loader = new GLTFLoader( ).setPath('https://cdn.glitch.com/a7bde607-48cf-44da-9dd9-d5b616b75906%2Fpeyote888888.glb?v=1616992492194');
				const self = this;

		// Load a glTF resource
		loader.load(
			// resource URL
			'peyote888888.glb',
			// called when the resource is loaded
			function ( gltf ) {
								const bbox = new THREE.Box3().setFromObject( gltf.scene );
								console.log(`min:${bbox.min.x.toFixed(2)},${bbox.min.y.toFixed(2)},${bbox.min.z.toFixed(2)} -  max:${bbox.max.x.toFixed(2)},${bbox.max.y.toFixed(2)},${bbox.max.z.toFixed(2)}`);

								gltf.scene.traverse( ( child ) => {
										if (child.isMesh){
												child.material.metalness = 0.2;
										}
								})
								self.chair = gltf.scene;

				self.scene.add( gltf.scene );



				self.renderer.setAnimationLoop( self.render.bind(self));
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
				);
		}
    initScene(){
        this.chair = new THREE.BoxBufferGeometry( 0.06, 0.06, 0.06 );
        this.meshes = [];
    }

    setupVR(){
        this.renderer.xr.enabled = true;

        const self = this;
        let controller;

        function onSelect() {
            const material = new THREE.MeshPhongMaterial( { color: 0xffffff * Math.random() } );
            const mesh = new THREE.Mesh( self.geometry, material );
            mesh.position.set( 0, 0, - 0.3 ).applyMatrix4( controller.matrixWorld );
            mesh.quaternion.setFromRotationMatrix( controller.matrixWorld );
            self.scene.add( mesh );
            self.meshes.push( mesh );

        }

        const btn = new ARButton( this.renderer );
				this.loadGLTF();

        controller = this.renderer.xr.getController( 0 );
        controller.addEventListener( 'select', onSelect );
        this.scene.add( controller );

        this.renderer.setAnimationLoop( this.render.bind(this) );
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

	render( ) {
        this.stats.update();

        this.meshes.forEach( (mesh) => { mesh.rotateY( 0.01 ); });
        this.renderer.render( this.scene, this.camera );
    }
}

export { App };
