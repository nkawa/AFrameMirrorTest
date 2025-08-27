"use client"
import AFRAME from 'aframe';
import * as React from 'react'

const THREE = window.AFRAME.THREE;

function registerComponents() {


    AFRAME.registerComponent('extra-camera', {
        init() {
            const sceneEl = this.el.sceneEl;
            const threeScene = sceneEl.object3D;
            const renderer = sceneEl.renderer;

            // レンダリングターゲットと仮想カメラ
            this.rt = new THREE.WebGLRenderTarget(480, 480);
            this.cam = new THREE.PerspectiveCamera(60, 1, 0.1, 100);

            // モニタ（plane）の material に貼る
            const monitorMesh = document.querySelector('#monitor').getObject3D('mesh');
            monitorMesh.material.map = this.rt.texture;
            monitorMesh.material.metalness = 0.2;
            monitorMesh.material.roughness = 0.8;

            this.box = document.querySelector('#base').object3D;

            // tick 内で更新
            this.tick = () => {
                // 箱を斜め上から撮影する感じ
                this.cam.position.set(0, 2, 0);
                this.cam.lookAt(this.box.position);

                const prev = renderer.getRenderTarget();
                renderer.setRenderTarget(this.rt);
                renderer.render(threeScene, this.cam);
                renderer.setRenderTarget(prev);
            };
        },
        remove() { this.rt.dispose(); }
    });
}


export default function Home() {

    React.useEffect(() => {
        registerComponents();
//        document.querySelector('#mirror').setAttribute('mirror-texture', '');
//        document.querySelector('#mirror').setAttribute('mirror-texture', '');
          document.querySelector('a-scene').setAttribute('extra-camera', '');

    }, []);

    return (
        <a-scene  xr-mode-ui='enabled: true; XRMode: xr'>

            <a-box id="spinningBox" color="tomato" depth="0.3" height="0.3" width="0.3"
                position="0 0.2 0"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 4000">
            </a-box>

            <a-box id="base" color="#7BC8A4"  position="0 -0.01 0.05" depth="0.8" height="0.02" width="1.2" opacity="0.7"> </a-box>

            <a-plane id="monitor"
                position="0 0.8 -3"
                rotation="0 0 0"
                width="1.6" height="1.2"
                material="shader: standard">
            </a-plane>

        </a-scene>
    );
}
