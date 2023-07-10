// https://unpkg.com/browse/@babylonjs/core@6.11.1/
import { ArcRotateCamera } from "@babylonjs/core/Cameras/arcRotateCamera.js";
import { Color4 } from "@babylonjs/core/Maths/math.color.js";
import { DirectionalLight } from "@babylonjs/core/Lights/directionalLight.js";
import { Engine } from "@babylonjs/core/Engines/engine.js";
import { Scene } from "@babylonjs/core/scene.js";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js";
import { ShadowGeneratorSceneComponent } from "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent.js";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial.js";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder.js";
import { Quaternion } from "@babylonjs/core/Maths/math.vector.js";
import { Vector3 } from "@babylonjs/core/Maths/math.vector.js";
import RAPIER from "rapier3d-compat";
import initRapier3D from "./init-rapier3d.js";

async function init() {
    await initRapier3D();
    const canvas = document.getElementById("renderCanvas");
    const engine = new Engine(canvas, true);

    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // Set Gravity
    const world = new RAPIER.World({ x: 0.0, y: -9.81, z: 0.0 });

    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera("Camera", -Math.PI / 2, Math.PI / 2.5, 15, new Vector3(0, 0, 0), scene);
    camera.setTarget(Vector3.Zero()); // This targets the camera to scene origin
    camera.attachControl(canvas, true); // This attaches the camera to the canvas

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new DirectionalLight("Light", new Vector3(0, -8, 2), scene);
    light.intensity = 0.7; // Default intensity is 1. Let's dim the light a small amount

    const shadowGen = new ShadowGenerator(1024, light);

    // Our built-in 'sphere' shape.
    const sphere = MeshBuilder.CreateSphere("Sphere", { diameter: 2, segments: 32 }, scene);
    shadowGen.addShadowCaster(sphere);

    // Our built-in 'ground' shape.
    const ground = MeshBuilder.CreateBox("Ground", { width: 6, height: 0.1, depth: 6 }, scene);
    ground.addRotation(0, 0, 0.1);
    ground.receiveShadows = true;

    // OK, pretending we don't know anything about the geometry so we can translate it to RAPIER:
    // For example, "ground" exists, but I want to get it like I am from a GLTF file.
    const groundMesh = scene.getMeshByName("Ground");
    const groundSizes = groundMesh.getBoundingInfo().maximum
    const groundColliderDesc = RAPIER.ColliderDesc.cuboid(
        groundSizes.x, groundSizes.y, groundSizes.z
    );

    const groundRotQ = groundMesh.rotation.toQuaternion()
    groundColliderDesc.setRotation(groundRotQ);

    // Add physics ground in world.
    world.createCollider(groundColliderDesc);

    // Sphere:
    const sphereMesh = scene.getMeshByName("Sphere");
    const sphereBounding = sphereMesh.getBoundingInfo().maximum;

    // Add a dynamic rigid body to go with the sphere collider.
    const sphereRigidDesc = RAPIER.RigidBodyDesc.dynamic();

    // Move the rigid body instead of the collider, when applicable.
    sphereRigidDesc.setTranslation(2.5, 5, 0);
    const sphereRigidBody = world.createRigidBody(sphereRigidDesc);

    const sphereColliderDesc = RAPIER.ColliderDesc.ball(sphereBounding.y + .01); // add a little space so lines render outside of the sphere
    sphereColliderDesc.setDensity(1.5);
    sphereColliderDesc.setRestitution(1.5);

    const sphereCollider = world.createCollider(
        sphereColliderDesc,
        sphereRigidBody
    );

    // set debug line system
    let linesystem

    // Update physics engine animation on Before Render
    let frame = 0;
    scene.onBeforeRenderObservable.add(() => {

        const position = sphereRigidBody.translation();
        sphereMesh.setAbsolutePosition(new Vector3(
            position.x, position.y, position.z
        ));

        const sRotation = sphereCollider.rotation(); // Quaternion
        sphereMesh.rotationQuaternion = new Quaternion(
            sRotation.x,
            sRotation.y,
            sRotation.z,
            sRotation.w
        );

        const buffers = world.debugRender();

        const debugLines = []
        for (let i = 0; i < buffers.vertices.length; i += 3) {
            debugLines.push(new Vector3(buffers.vertices[i], buffers.vertices[i + 1], buffers.vertices[i + 2]))
        }

        if (!linesystem) {
            const debugColors = []
            for (let i = 0; i < buffers.colors.length; i += 4) {
                debugColors.push(new Color4(buffers.colors[i], buffers.colors[i + 1], buffers.colors[i + 2], buffers.colors[i + 3]))
            }
            linesystem = MeshBuilder.CreateLineSystem("linesystem", { lines: [debugLines], colors: [debugColors], updatable: true }, scene);
        } else {
            MeshBuilder.CreateLineSystem("line", { lines: [debugLines], instance: linesystem });
        }

        world.step();

        // reset the sphere every 400 frames
        if (frame >= 400) {
            sphereRigidBody.setTranslation({ x: 2.5, y: 5, z: 0 }, true)
            sphereRigidBody.setRotation({ w: 1.0, x: 0.0, y: 0.0, z: 0.0 }, true)
            sphereRigidBody.setLinvel({ x: 0, y: 0, z: 0 }, true)
            sphereRigidBody.setAngvel({ x: 0, y: 0, z: 0 }, true);
            return frame = 0
        }

        frame++
    });

    window.onresize = () => {
        engine.resize();
    }

    engine.runRenderLoop(() => {
        scene.render();
    });
}

init();
