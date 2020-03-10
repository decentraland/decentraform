var model = 'model.glb'
var angle = 0

dcl.subscribe('sceneStart')

var GLTF_Shape = 54
var Transform_Component = 1

var EntityId = 'E0'
var ShapeId = 'Cb'

dcl.componentCreated(ShapeId, 'engine.shape', GLTF_Shape)
dcl.componentUpdated(ShapeId, JSON.stringify({
  withCollisions: true,
  visible: true,
  src: model
}))
dcl.addEntity(EntityId)
dcl.attachEntityComponent(EntityId, 'engine.shape', ShapeId)

dcl.updateEntityComponent(EntityId, 'engine.transform', Transform_Component, JSON.stringify({
  position: { x: 8, y: 0, z: 8 },
  rotation: { y: Math.sin(angle), x: 0, w: Math.cos(angle), z: 0 },
  scale: { x: 1, y: 1, z: 1 }
}))

dcl.setParent(EntityId, '0')
