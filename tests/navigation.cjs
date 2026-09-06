const vm=require('vm'),fs=require('fs'),assert=require('assert/strict'),context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../navigation.js','utf8'),context);const nav=context.window.PipNavigation;
const onSegment=(p,a,b)=>{const cross=(p.x-a.x)*(b.y-a.y)-(p.y-a.y)*(b.x-a.x);return Math.abs(cross)<.00001&&p.x>=Math.min(a.x,b.x)-.001&&p.x<=Math.max(a.x,b.x)+.001&&p.y>=Math.min(a.y,b.y)-.001&&p.y<=Math.max(a.y,b.y)+.001;};
for(const scene of ['village','shop'])for(const size of [{width:1250,height:625},{width:768,height:530},{width:390,height:370}]){
 const graph=nav.graphs[scene],onEdge=(p,q)=>graph.edges.some(([a,b])=>onSegment(p,nav.point(scene,a),nav.point(scene,b))&&onSegment(q,nav.point(scene,a),nav.point(scene,b)));
 for(const start of Object.keys(graph.nodes))for(const end of Object.keys(graph.nodes)){let p=nav.point(scene,start);const path=nav.route(scene,p,end,size);assert(path.length<=Object.keys(graph.nodes).length+1);for(const q of path){assert(onEdge(p,q),scene+' every leg follows authored path');p=q;}assert.equal(p.x,nav.point(scene,end).x);assert.equal(p.y,nav.point(scene,end).y);}
 for(const [a,b] of graph.edges){const p=nav.point(scene,a),q=nav.point(scene,b),mid={x:(p.x+q.x)/2,y:(p.y+q.y)/2};for(const end of Object.keys(graph.nodes)){const path=nav.route(scene,mid,end,size);assert(onEdge(mid,path[0]),'rapid retarget stays on current edge');}}
}
console.log('PASS: every authored route pair and mid-edge retarget at desktop/tablet/phone scales, finite paths and exact door/interaction endpoints.');
