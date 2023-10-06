const THREE = window.MINDAR.IMAGE.THREE;
import {mockWithVideo, mockWithImage} from './libs/camera-mock.js';
import {loadGLTF} from "./libs/loader.js";
import { Vector3, } from './libs/three.js-r132/build/three.module.js';
import { FontLoader } from './libs/three.js-r132/build/three.module.js';
import { RGBELoader } from './libs/three.js-r132/examples/jsm/loaders/RGBELoader.js';
import { CSS3DObject } from './libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';
console.log(THREE);

let anchors = [];
let loaded = 0;
let font;
let materials;
let textMesh1;
const models = [
    ["./static/models/Profetas/Isaias/Profeta 1 - Isaias.gltf", "Isaias"]
]; 
const transforms = [
    // scale, rotation, position
    [new Vector3(1.25,1.25,1.25),new THREE.Euler(0,0,0),new Vector3(0,0,0)]
]

async function LoadModelAttachToAnchorIndex(mindarThree, transform, model, index){
    // This is the anchor of the Marker Index 0
    const anchor = mindarThree.addAnchor(index);
    // Loading GLTF
    const gltf = await loadGLTF(model[0]);
    gltf.scene.transform
    gltf.scene.scale.copy(transform[0]);
    gltf.scene.rotation.copy(transform[1]);
    gltf.scene.position.copy(transform[2]);
    // Adding gltf1 to marker index 0 group
    anchor.group.add(gltf.scene);
    //anchors.push(anchor);
    anchor.onTargetFound = () => {
        console.log("Found anchor: "+ index +", name: " + model[1]);
    };
    anchor.onTargetLost = () => {
        console.log("Lost anchor: "+ index +", name: " + model[1]);
    };
}
let text = document.getElementById("info");


document.addEventListener("DOMContentLoaded", () => {
    const start = async () => {
        //mockWithImage();
        //mockWithVideo("./static/mov/test.mp4");

        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.body,
            imageTargetSrc: './static/target/targets.mind',
            uiLoading: "no",
            uiScanning: "yes",
            // uiError: "yes",
            // filterMinCF:0, 
            // filterBeta:0, 
            // warmupTolerance:0, 
            // missTolerance:0,
            //maxTrack:2
        });

        const loader = new FontLoader();
        loader.load( './static/font/helvetiker_regular.typeface.json', function ( _font ) {
            font = _font;
        } );
        materials = [
            new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: 0xffffff } ) // side
        ];

        console.log(mindarThree);

        const {renderer, scene, camera} = mindarThree;

        

        AddLight(scene);

        for (let i=0;i<10;i++) {
            await LoadModelAttachToAnchorIndex(mindarThree, transforms[i], models[i],i);
            text.textContent = "Baixando Objetos 3D: " + (i+1)*10 + "%";
            renderer.render(scene, camera);
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        text.textContent = "Aleijadinho AR";
        await new Promise(resolve => setTimeout(resolve, 2500));
        text.textContent = "Iniciando Realidade Aumentada";
        await new Promise(resolve => setTimeout(resolve, 1000));
        text.textContent = "Iniciando Realidade Aumentada.";
        await new Promise(resolve => setTimeout(resolve, 500));
        text.textContent = "Iniciando Realidade Aumentada..";
        await new Promise(resolve => setTimeout(resolve, 500));
        text.textContent = "Iniciando Realidade Aumentada...";
        await new Promise(resolve => setTimeout(resolve, 500));
        text.remove();
        await mindarThree.start();

        
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);

        });
    }
    start();
});

function AddLight(scene){
    new RGBELoader()
    .setPath('./static/hdri/')
    .load('01.hdr', function ( texture ) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        let skyboxMat = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        fog: false,
        depthWrite: false,
        });
        //scene.background = texture;
        scene.environment = texture;
    }); 
}

function AddNewText(scene){
    textMesh1 = null;
	const geometry = new THREE.TextGeometry( 'Loaded: ' + loaded , {
		font: font,
		size: 20,
		height: 5,
		curveSegments: 12,
		bevelEnabled: true,
		bevelThickness: 10,
		bevelSize: 8,
		bevelOffset: 0,
		bevelSegments: 5
	} );

    textMesh1 = new THREE.Mesh( geometry, materials );
    textMesh1.position.x = 0;
    textMesh1.position.y = 0;
    textMesh1.position.z = -10;

    scene.add( textMesh1 );

}