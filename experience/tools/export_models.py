"""Read the supplied source; bake unsupported procedural materials and export copies.
Never saves or overwrites the source .blend. Geometry is not remodelled or decimated.
"""
import bpy,os,math,json,hashlib
from mathutils import Vector
ROOT='/Users/pc/Desktop/무제 폴더 2'
OUT=ROOT+'/luum/experience/public/models'
os.makedirs(OUT,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=ROOT+'/LUUM_TEXTURE.blend')
scene=bpy.context.scene
scene.render.engine='CYCLES';scene.cycles.samples=8
scene.render.bake.use_pass_direct=False;scene.render.bake.use_pass_indirect=False;scene.render.bake.use_pass_color=True
scene.render.bake.margin=8
# Export copies cannot preserve anisotropy on the source metal without UV tangents.
for metal in bpy.data.materials:
 if metal.name=='LUUM_GOLD_CHAMPAGNE_SATIN' and metal.use_nodes:
  shader=next(n for n in metal.node_tree.nodes if n.type=='BSDF_PRINCIPLED')
  if 'Anisotropic IOR Level' in shader.inputs:shader.inputs['Anisotropic IOR Level'].default_value=0
manifest=[]
for i in range(1,6):
 sid=f'{i:02}'
 body=bpy.data.objects['BODY_'+sid]
 objects=list(bpy.data.collections['PRODUCT_'+sid].objects)
 bpy.ops.object.select_all(action='DESELECT');body.select_set(True);bpy.context.view_layer.objects.active=body
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT')
 bpy.ops.uv.smart_project(angle_limit=math.radians(70),island_margin=0.012)
 bpy.ops.object.mode_set(mode='OBJECT')
 mat=body.active_material;nodes=mat.node_tree.nodes;links=mat.node_tree.links
 bsdf=next(n for n in nodes if n.type=='BSDF_PRINCIPLED')
 textures={}
 for kind,bake_type in [('color','DIFFUSE'),('normal','NORMAL')]:
  img=bpy.data.images.new(f'luum-{sid}-{kind}',width=1024,height=1024,alpha=False)
  if kind=='normal':img.colorspace_settings.name='Non-Color'
  target=nodes.new('ShaderNodeTexImage');target.image=img;nodes.active=target
  print('BAKE',sid,kind,flush=True)
  bpy.ops.object.bake(type=bake_type)
  img.filepath_raw=OUT+f'/luum-{sid}-{kind}.png';img.file_format='PNG';img.save()
  textures[kind]=img
 # Replace unsupported procedural graph in this in-memory export copy only.
 nodes.clear();out=nodes.new('ShaderNodeOutputMaterial');p=nodes.new('ShaderNodeBsdfPrincipled')
 p.inputs['Roughness'].default_value=.79;links.new(p.outputs['BSDF'],out.inputs['Surface'])
 c=nodes.new('ShaderNodeTexImage');c.image=textures['color'];links.new(c.outputs['Color'],p.inputs['Base Color'])
 n=nodes.new('ShaderNodeTexImage');n.image=textures['normal'];normal=nodes.new('ShaderNodeNormalMap')
 links.new(n.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],p.inputs['Normal'])
 bpy.ops.object.select_all(action='DESELECT')
 offset=body.location.x
 for o in objects:o.select_set(True);o.location.x-=offset
 bpy.ops.export_scene.gltf(filepath=OUT+f'/luum-{sid}.glb',export_format='GLB',use_selection=True,export_yup=True,export_materials='EXPORT',export_cameras=False,export_lights=False,export_animations=False)
 manifest.append({'id':sid,'objects':[o.name for o in objects],'triangles':sum(len(o.data.polygons) for o in objects),'sourceHeight':body.dimensions.z})
 print('EXPORTED',sid,flush=True)
open(OUT+'/manifest.json','w').write(json.dumps(manifest,indent=2))
print('DONE_SOURCE_UNCHANGED',flush=True)
