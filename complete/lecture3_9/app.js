import * as THREE from '../../libs/three/three.module.js';
import { OrbitControls } from '../../libs/three/jsm/OrbitControls.js';
import { Stats } from '../../libs/stats.module.js';
import { ARButton } from '../../libs/ARButton.js';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader.js';
import { Player } from '../../libs/Player.js';

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

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.target.set(0, 3.5, 0);
        this.controls.update();

        this.stats = new Stats();

        this.initScene();
        this.setupVR();

        window.addEventListener('resize', this.resize.bind(this) );
	}

    initScene(){

			this.assetsPath = '../../assets/';
			const loader = new GLTFLoader().setPath(this.assetsPath);
	const self = this;

	// Load a GLTF resource
	loader.load(
		// resource URL
		`knight2.glb`,
		// called when the resource is loaded
		function ( gltf ) {
			const object = gltf.scene.children[5];

			object.traverse(function(child){
				if (child.isMesh){
											child.material.metalness = 0;
											child.material.roughness = 1;


        this.geometry = new THREE.TorusKnotBufferGeometry( 0.06, 0.06, 0.06 );
        this.meshes = [];


    }
	});
	const options = {
		object: object,
		speed: 0.5,
		animations: gltf.animations,
		clip: gltf.animations[0],
		app: self,
		name: 'knight',
		npc: false
	};

	self.knight = new Player(options);
					self.knight.object.visible = false;

	self.knight.action = 'Dance';
	const scale = 0.003;
	self.knight.object.scale.set(scale, scale, scale);

					self.loadingBar.visible = false;
},

function ( error ) {

	console.log( 'An error happened' );

}
);

	this.createUI();
}

createUI() {

	const config = {
			panelSize: { width: 0.15, height: 0.038 },
			height: 128,
			info:{ type: "text" }
	}
	const content = {
			info: "Debug info"
	}

	const ui = new CanvasUI( content, config );

	this.ui = ui;
}
// called while loading is progressing

    setupXR(){
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
				const btn = new ARButton( this.renderer, { onSessionStart, onSessionEnd });//, sessionInit: { optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body } } } );

				this.gestures = new ControllerGestures( this.renderer );
				this.gestures.addEventListener( 'tap', (ev)=>{
						//console.log( 'tap' );
						self.ui.updateElement('info', 'tap' );
						if (!self.knight.object.visible){
								self.knight.object.visible = true;
								self.knight.object.position.set( 0, -0.3, -0.5 ).add( ev.position );
								self.scene.add( self.knight.object );
						}
				});
        const btn = new ARButton( this.renderer );

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





				const dt = this.clock.getDelta();
        this.stats.update();
        if ( this.renderer.xr.isPresenting ){
            this.gestures.update();
            this.ui.update();
        }
        if ( this.knight !== undefined ) this.knight.update(dt);
        this.renderer.render( this.scene, this.camera );
    }
    }


export { App };


