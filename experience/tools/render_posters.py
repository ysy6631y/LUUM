import bpy,math,os
from mathutils import Vector
ROOT='/Users/pc/Desktop/무제 폴더 2';OUT=ROOT+'/luum/experience/public/models'
bpy.ops.wm.open_mainfile(filepath=ROOT+'/LUUM_TEXTURE.blend')
s=bpy.context.scene;s.render.engine='CYCLES';s.cycles.samples=24;s.cycles.use_denoising=True
s.render.resolution_x=600;s.render.resolution_y=760;s.render.resolution_percentage=100;s.render.film_transparent=True
s.render.image_settings.file_format='PNG';s.render.image_settings.color_mode='RGBA';s.view_settings.view_transform='AgX'
for o in list(s.objects):
 if o.type in ['LIGHT','CAMERA']:bpy.data.objects.remove(o,do_unlink=True)
s.world.use_nodes=True;bg=next(n for n in s.world.node_tree.nodes if n.type=='BACKGROUND');bg.inputs[0].default_value=(.85,.8,.72,1);bg.inputs[1].default_value=.25
camdata=bpy.data.cameras.new('Export preview');cam=bpy.data.objects.new('Export preview',camdata);s.collection.objects.link(cam);s.camera=cam;camdata.type='ORTHO';camdata.ortho_scale=.26
for name,pos,energy,size in [('Key',(-.18,-.3,.4),2,.3),('Edge',(.17,.12,.3),3,.2),('Fill',(.3,-.15,.16),1,.25)]:
 d=bpy.data.lights.new(name,'AREA');d.energy=energy;d.shape='DISK';d.size=size;o=bpy.data.objects.new(name,d);s.collection.objects.link(o);o.location=pos;o.rotation_euler=(Vector((0,0,.1))-o.location).to_track_quat('-Z','Y').to_euler()
for i in range(1,6):
 sid=f'{i:02}';body=bpy.data.objects['BODY_'+sid];x=body.location.x;h=body.dimensions.z
 for o in s.objects:
  if o.type=='MESH':o.hide_render=not o.name.endswith('_'+sid)
 cam.location=(x,-.5,h*.5+.09);cam.rotation_euler=(Vector((x,0,h*.5))-cam.location).to_track_quat('-Z','Y').to_euler();camdata.ortho_scale=.26 if i<5 else .135
 s.render.filepath=OUT+f'/luum-{sid}.png';bpy.ops.render.render(write_still=True)
 print('POSTER',sid,flush=True)
