/* Feet anchors authored on the 1250x625 source pictures, expressed as percentages.
   Backgrounds use 100% 100%; the same affine scale places paths and sprites. */
window.PipNavigation=(()=>{
 const graphs={
  village:{walkable:[[21,53],[34,46],[52,43],[68,47],[82,65],[84,80],[62,87],[38,88],[20,72]],nodes:{spawn:[50,80],cross:[47,67],west:[36,66],book:[27,57],mapBend:[49,54],map:[43,47],shopPath:[59,55],shop:[63,52],east:[61,64],gatePath:[72,69],play:[80,75.5]},edges:[['spawn','cross'],['cross','west'],['west','book'],['cross','mapBend'],['mapBend','map'],['mapBend','shopPath'],['shopPath','shop'],['cross','east'],['east','shopPath'],['east','gatePath'],['gatePath','play']]},
  shop:{nodes:{spawn:[50,85],center:[50,70],left:[27,64],middle:[50,64],right:[73,64],exit:[50,94]},edges:[['spawn','center'],['center','left'],['center','middle'],['center','right'],['left','middle'],['middle','right'],['spawn','exit']]}
 };
 const point=(graph,id)=>{const [x,y]=graphs[graph].nodes[id];return {x,y};};
 const distance=(a,b,size)=>Math.hypot((a.x-b.x)*size.width/100,(a.y-b.y)*size.height/100);
 const isWalkable=(scene,p)=>{const polygon=graphs[scene].walkable;if(!polygon)return true;let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [xi,yi]=polygon[i],[xj,yj]=polygon[j];if(((yi>p.y)!==(yj>p.y))&&p.x<(xj-xi)*(p.y-yi)/(yj-yi)+xi)inside=!inside;}return inside;};
 const safeDirect=(scene,from,to)=>{for(let step=0;step<=20;step++){const t=step/20;if(!isWalkable(scene,{x:from.x+(to.x-from.x)*t,y:from.y+(to.y-from.y)*t}))return false;}return true;};
 function route(scene,from,destination,size={width:1250,height:625}){
  const graph=graphs[scene],nodes=Object.fromEntries(Object.keys(graph.nodes).map(id=>[id,point(scene,id)]));
  if(!nodes[destination])throw Error('Unknown doorway/interaction anchor');
  // The village foreground is all walkable grass and stone, so the shortest
  // direct stroll looks more natural than invisible road-graph corners.
  const stroll=Math.hypot(from.x-nodes[destination].x,from.y-nodes[destination].y);
  if(scene==='village'&&stroll<=27&&safeDirect(scene,from,nodes[destination]))return [nodes[destination]];
  let attach,best=Infinity;
  for(const [a,b] of graph.edges){const p=nodes[a],q=nodes[b],dx=(q.x-p.x)*size.width,dy=(q.y-p.y)*size.height,t=Math.max(0,Math.min(1,((from.x-p.x)*size.width*dx+(from.y-p.y)*size.height*dy)/(dx*dx+dy*dy))),projection={x:p.x+t*(q.x-p.x),y:p.y+t*(q.y-p.y)},d=distance(from,projection,size);if(d<best){best=d;attach={a,b,projection};}}
  nodes.start=attach.projection;const edges=[...graph.edges,['start',attach.a],['start',attach.b]],cost={start:0},previous={},pending=new Set(Object.keys(nodes));
  while(pending.size){let current=[...pending].sort((a,b)=>(cost[a]??Infinity)-(cost[b]??Infinity))[0];pending.delete(current);if(current===destination)break;if(!Number.isFinite(cost[current]))break;for(const [a,b] of edges){const next=a===current?b:b===current?a:null;if(!next||!pending.has(next))continue;const value=cost[current]+distance(nodes[current],nodes[next],size);if(value<(cost[next]??Infinity)){cost[next]=value;previous[next]=current;}}}
  const path=[];for(let id=destination;id&&id!=='start';id=previous[id])path.unshift(nodes[id]);if(best>.01)path.unshift(attach.projection);return path;
 }
 return {graphs,point,route,distance,isWalkable};
})();
