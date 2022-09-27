import * as THREE from 'three'
import { useFrame } from "@react-three/fiber";
import { generateUUID } from "three/src/math/MathUtils";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { useCursor, MeshReflectorMaterial, Image, Text, Environment } from '@react-three/drei'

const sphericalToCart = ( r, theta, phi ) => {
  return new THREE.Vector3(
    r * Math.cos( theta ) * Math.sin( phi ),
    r * Math.sin( phi ) * Math.sin( theta ),
    r * Math.cos( phi )
  )
}

export default function SphereObject( props ) {
  const geom = useRef()
  const image = useRef()
  const {
    radius = 10,
    theta = 0,
    phi = 0,
    movement = [0,1],
    url,
    speed= 1.0,
    onHover,
    onClick,
    isSelected = false,
    name,
    p = new THREE.Vector3(0,0,-1.5)
  } = props;
  const [ hovered, hover ] = useState(false)
  const [ currentPos, setCurrentPos ] = useState( sphericalToCart( radius, theta, phi ) )
  const [ currentRadius, setCurrentRadius ] = useState( radius )
  const [scale, setScale] = useState([4,4,4])
  useCursor(hovered)
  const [rnd] = useState(() => Math.random())
  const color = new THREE.Color()
  
  useFrame(({clock, camera}) => {
    const newTheta = -180 + theta + movement[0] * clock.elapsedTime * speed
    const newPhi = 180 - phi + movement[1] * clock.elapsedTime * speed
    image?.current?.lookAt(0,0,0)
    geom?.current?.lookAt(0,0,0)
    // geom.current.quaternion.copy(camera.quaternion)
    // console.log( 'camera', camera )
    let a = p;
    let toScale = new Vector3(4,4,4)
    const theScale = new Vector3( scale.x, scale.y, scale.z )
    a = new Vector3(-camera.position.x, -camera.position.y, -camera.position.z)

    if ( isSelected ) {

      // setCurrentPos( [0,0,-3] )
      const from = new Vector3( currentPos.x, currentPos.y, currentPos.z )
      
      setCurrentPos( from.lerp(a, 0.095) )
      toScale.x = 10
      toScale.y = 10
      toScale.z = 10
      // console.log( currentPos )
      
    } else {
      const from = new Vector3( currentPos.x, currentPos.y, currentPos.z )
      setCurrentPos( from.lerp(sphericalToCart( currentRadius, newTheta, newPhi ), 0.025) )
      // setCurrentPos(  )
      // setScale([3,3,3])
    }
    setScale( theScale.lerp( toScale, 0.25 ))
    // setCurrentPos( sphericalToCart( currentRadius, newTheta, newPhi ) )

    
    // camera.quaternion.slerp(q, 0.025)

    // setCurrentRadius( radius + Math.sin( clock.elapsedTime / 4. ) )
   
    image.current.material.color.lerp(color.set(hovered && ! isSelected ? '#ffff55' : 'white'), 0.3)
  })

  return (
    <group name={ name }>
      <mesh
        onPointerOver={(e) => (e.stopPropagation(), hover(true), onHover())}
        onPointerOut={() => hover(false)}
        onClick={() => onClick()}
        position={currentPos}
        ref={ geom }
        scale={scale}
      >
        <Image
          color="#151515"
          ref={image}
          url={url}
        />
        <planeGeometry/>
        <meshStandardMaterial transparent={ true } opacity={ 0 }/>
      </mesh>
    </group>
  )

}