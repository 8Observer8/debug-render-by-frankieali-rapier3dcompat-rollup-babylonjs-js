import rapier from "rapier3d-compat";

export default function initRapier3D() {
    return new Promise(resolve => {
        rapier.init().then(() => {
            resolve();
        });
    });
}
