/* One catalogue for the room, dressing mirror, saved looks and avatar renderer. */
window.PipCosmetics=(()=>{
  const root='assets/outfitters/';
  const defaults={outfit:'auto',head:'goggles',clothes:'scarf',boots:'bare-feet',held:'empty-hand',fur:'original-fur',glow:'no-glow',chime:'no-chime'};
  const items=[];
  function add(id,name,slot,cost,family,extra={}){items.push({id,name,slot,cost,family,icon:root+'items/'+id+'.webp',...extra});}
  add('auto','Journey outfit','outfit',0,'Courier',{art:'assets/pip-sprite-atlas-v4.webp',walk:'assets/journey/pip-walk.webp',icon:root+'items/auto.webp'});
  add('mix','My own mix','outfit',0,'Your style',{icon:root+'items/goggles.webp'});
  for(const [id,name,phase] of [['rainfinder','Rainfinder',3],['windrider','Windrider',4],['starpilot','Starpilot',5]])add(id,name+' · legacy','outfit',30,'Legacy outfits',{art:`assets/pip-phase${phase}-${id}-atlas-v2.webp`,walk:root+'legacy-'+id+'-walk.webp',icon:root+'items/'+id+'.webp',legacy:true});
  add('goggles','Courier goggles','head',0,'Courier');add('no-hat','No hat','head',0,'Basics',{icon:root+'items/auto.webp',empty:true});
  for(const row of [['acorn-cap','Acorn cap',30,'Bramble Scout'],['rain-hood','Yellow rain hood',32,'Rainfinder'],['courier-cap','Feathered courier cap',35,'Courier'],['crystal-circlet','Crystal circlet',45,'Crystal Voyager'],['wizard-hat','Star wizard hat',70,'Starbound']])add(row[0],row[1],'head',row[2],row[3]);
  add('scarf','Courier scarf','clothes',0,'Courier');add('no-top','Natural coat','clothes',0,'Basics',{icon:root+'items/auto.webp',empty:true});
  for(const row of [['scout-vest','Moss scout vest',18,'Bramble Scout'],['raincoat','Sunshine raincoat',24,'Rainfinder'],['coral-shirt','Coral courier shirt',16,'Courier'],['star-tunic','Indigo star tunic',24,'Starbound'],['crystal-jacket','Silver crystal jacket',24,'Crystal Voyager']])add(row[0],row[1],'clothes',row[2],row[3]);
  add('bare-feet','Panda paws','boots',0,'Basics',{icon:root+'items/auto.webp',empty:true});
  for(const row of [['wellies','Yellow wellies',18,'Rainfinder'],['leaf-boots','Leaf boots',16,'Bramble Scout'],['courier-boots','Copper courier boots',20,'Courier'],['snow-boots','Crystal snow boots',24,'Crystal Voyager']])add(row[0],row[1],'boots',row[2],row[3]);
  add('empty-hand','Hands free','held',0,'Basics',{icon:root+'items/auto.webp',empty:true});
  for(const row of [['lantern','Sky lantern',35,'Courier'],['wind-wand','Wind wand',30,'Rainfinder'],['wood-sword','Wooden practice sword',32,'Bramble Scout'],['crystal-staff','Crystal staff',80,'Crystal Voyager']])add(row[0],row[1],'held',row[2],row[3]);
  add('original-fur','Original red panda','fur',0,'Basics',{icon:root+'items/auto.webp',empty:true});
  for(const row of [['cinnamon','Cinnamon','#ad562f'],['silver-mist','Silver mist','#91a8b5'],['midnight','Midnight blue','#405991'],['lavender','Lavender','#a474be']])add(row[0],row[1],'fur',10,'Fur dyes',{swatch:row[2],icon:root+'items/fur-'+row[0]+'.webp'});
  add('no-glow','No glow','glow',0,'Basics',{icon:root+'items/lantern.webp',empty:true});
  add('aqua','Aqua glow','glow',15,'Magic',{icon:'assets/journey/items/aqua.webp',swatch:'#36ffd2'});add('sunset','Sunset glow','glow',30,'Magic',{icon:'assets/journey/items/sunset.webp',swatch:'#ffb343'});
  add('fireflies','Firefly motes','glow',45,'Bramble Scout',{icon:root+'items/acorn-cap.webp',swatch:'#c0ed71'});add('starlight','Starlight halo','glow',90,'Starbound',{icon:root+'items/wizard-hat.webp',swatch:'#caaaff'});
  add('no-chime','Quiet steps','chime',0,'Basics',{icon:'assets/journey/items/chime.webp',empty:true});add('chime','Crystal chime','chime',25,'Magic',{icon:'assets/journey/items/chime.webp'});
  const byId=Object.fromEntries(items.map(i=>[i.id,Object.freeze(i)]));
  const categories=[['head','Hats'],['clothes','Clothes'],['boots','Boots'],['held','Held items'],['fur','Fur dyes'],['magic','Magic'],['outfit','Outfits']];
  function clean(look={}){look ||= {};return Object.fromEntries(Object.entries(defaults).map(([slot,id])=>[slot,byId[look[slot]]?.slot===slot?look[slot]:id]));}
  function withItem(look,id){const item=byId[id];if(!item)return clean(look);const next=clean(look);next[item.slot]=id;if(item.slot==='outfit'&&id!=='mix'){Object.assign(next,defaults,{outfit:id,glow:next.glow,chime:next.chime});}else if(['head','clothes','boots','held','fur'].includes(item.slot))next.outfit='mix';return next;}
  return {root,items,byId,defaults,categories,clean,withItem};
})();
