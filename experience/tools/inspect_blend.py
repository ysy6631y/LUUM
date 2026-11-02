import bpy,json
from mathutils import Vector
bpy.ops.wm.open_mainfile(filepath='/Users/pc/Desktop/무제 폴더 2/LUUM_TEXTURE.blend')
info={'collections':[{ 'name':c.name,'objects':len(c.objects)} for c in bpy.data.collections], 'objects':[],'materials':[]}
for o in bpy.context.scene.objects:
 if o.type=='MESH':
  bb=[o.matrix_world@Vector(c) for c in o.bound_box]
  info['objects'].append({'name':o.name,'loc':list(o.location),'size':list(o.dimensions),'bounds':[[min(v[i] for v in bb) for i in range(3)],[max(v[i] for v in bb) for i in range(3)]],'verts':len(o.data.vertices),'materials':[m.name for m in o.data.materials if m],'parent':o.parent.name if o.parent else None})
for m in bpy.data.materials:
 info['materials'].append({'name':m.name,'nodes':[{'type':n.type,'name':n.name,'image':n.image.name if n.type=='TEX_IMAGE' and n.image else None,'inputs':{i.name:list(i.default_value) if hasattr(i.default_value,'__len__') else i.default_value for i in n.inputs if hasattr(i,'default_value') and i.name in ['Base Color','Metallic','Roughness','Scale','Strength']}} for n in m.node_tree.nodes] if m.use_nodes else []})
open('/tmp/luum-blend-inspect.json','w').write(json.dumps(info,ensure_ascii=False,indent=2))
print('INSPECT_WRITTEN',len(info['objects']))
