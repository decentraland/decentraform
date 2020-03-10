
const _scene = new Entity('_scene')
engine.addEntity(_scene)
const transform = new Transform({
  position: new Vector3(0, 0, 0),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
_scene.addComponentOrReplace(transform)

const bermudaGrass = new Entity('bermudaGrass')
engine.addEntity(bermudaGrass)
bermudaGrass.setParent(_scene)
const gltfShape = new GLTFShape("models/FloorBaseGrass_01/FloorBaseGrass_01.glb")
gltfShape.withCollisions = true
gltfShape.visible = true
bermudaGrass.addComponentOrReplace(gltfShape)
const transform2 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(1, 1, 1)
})
bermudaGrass.addComponentOrReplace(transform2)

const alchemistContraption = new Entity('alchemistContraption')
engine.addEntity(alchemistContraption)
alchemistContraption.setParent(_scene)
const transform3 = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: new Quaternion(0, 0, 0, 1),
  scale: new Vector3(5, 5, 5)
})
alchemistContraption.addComponentOrReplace(transform3)
const gltfShape2 = new GLTFShape("models/Pillar_Fire_01/Pillar_Fire_01.glb")
gltfShape2.withCollisions = true
gltfShape2.visible = true
alchemistContraption.addComponentOrReplace(gltfShape2)
