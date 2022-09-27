import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree} from '@react-three/fiber'
import SphereObject from './sphere-object'
import { useEffect, useRef, useState } from 'react';
import { useRoute, useLocation } from 'wouter'
import { OrbitControls } from '@react-three/drei';

function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('../public/images', false, /\.(png|jpe?g|svg)$/));

const initialPositions = Array.from({length: 128}, (x, i) => [i%18,i])
const movements = Array.from({length: 128}, (_, i) => [(i%18),i%9])

const GOLDENRATIO = 1.61803398875

const controlArgs = {
  enableDamping: true,
  enablePan: false,
  enableRotate: true,
  enableZoom: true,
  reverseOrbit: false,
}

export default function Scene3D({q = new THREE.Quaternion(), p = new THREE.Vector3()}){
  const [hoveredIndex, setHoveredIndex] = useState();
  const [selectedIndex, setSelectedIndex ] = useState();

  const [rnd] = useState(() => Math.random())

  const [, params] = useRoute('/nft/:id')
  const [, setLocation] = useLocation()
  const ref = useRef()
  const clicked = useRef()

  // useEffect(() => {
  //   clicked.current = ref.current?.getObjectByName(params?.id)
  //   console.log( 'clicked', ref.current?.getObjectByName(params?.id) );
  //   if (clicked.current) {
  //     clicked.current.parent.updateWorldMatrix(true, true)
  //     clicked.current.parent.localToWorld(p.set(0, GOLDENRATIO / 2, 1.25))
  //     clicked.current.parent.getWorldQuaternion(q)
  //   } else {
  //     p.set(0, 0, 100.5)
  //     q.identity()
  //   }
  // })

  useEffect( () => {
    console.log( 'init component', params )
    if ( params?.id ) {
      setSelectedIndex( params?.id )
    }
  }, [] )

  return (
    <div id="canvas-container">
      <div id="info">
        <h2>{ `Laughing at your currency #${ hoveredIndex }` }</h2>
        <p>Some description about the NFT</p>
      </div>

      <Canvas gl={{ alpha: false }} dpr={[1, 1.5]} camera={{ fov: 70, near: 1 }}>
        <OrbitControls { ...controlArgs } position={[10,10,10]}/>
        <color attach="background" args={['#000']} />
        <ambientLight intensity={10} />
        <directionalLight color="purple" position={[50, 50, 50]} />
        <group ref={ref}>
        { initialPositions.map( (pos, idx) =>
          <SphereObject
            key={ `sphereobject-${idx}` }
            radius={ 8 }
            phi={ pos[0] }
            theta={ pos[1] }
            speed={ 0.01 }
            movement={ movements[idx] }
            url={ images[idx % images.length] }
            onHover={ () => setHoveredIndex( idx ) }
            onClick={ ( e ) => {
              setSelectedIndex( hoveredIndex )
              setLocation('/nft/' + hoveredIndex )
            }}
            isSelected={ idx === selectedIndex }
          /> ) }
        </group>
      </Canvas>
    </div>
  )
}