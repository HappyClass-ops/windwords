window.PipWardrobe={create({storage,wallet,changed=()=>{}}){
 const key='wordwind_wardrobe_v1',items=[{id:'auto',name:'Journey outfit',cost:0,art:'assets/pip-sprite-atlas-v4.webp'},{id:'rainfinder',name:'Rainfinder',cost:10,art:'assets/pip-phase3-rainfinder-atlas-v2.webp'},{id:'windrider',name:'Windrider',cost:10,art:'assets/pip-phase4-windrider-atlas-v2.webp'},{id:'starpilot',name:'Starpilot',cost:10,art:'assets/pip-phase5-starpilot-atlas-v2.webp'}];
 let owned=new Set(['auto']),equipped='auto',preview=null;
 try{const data=JSON.parse(storage.getItem(key));if(data?.version===1){for(const id of data.owned||[])if(items.some(i=>i.id===id))owned.add(id);if(owned.has(data.equipped))equipped=data.equipped;}}catch{}
 const save=()=>{try{storage.setItem(key,JSON.stringify({version:1,owned:[...owned],equipped}));}catch{}};
 const current=()=>preview||equipped;
 function select(id){if(!items.some(i=>i.id===id))return false;preview=id;changed();return true;}
 function buyOrEquip(){const item=items.find(i=>i.id===current());if(!item)return false;if(!owned.has(item.id)){if(!wallet.spend(item.cost))return false;owned.add(item.id);}equipped=item.id;preview=equipped;save();changed();return true;}
 return {open(){preview=equipped;changed();},close(){preview=null;changed();},select,buyOrEquip,refresh:changed,get art(){return current()==='auto'?null:items.find(i=>i.id===current()).art;},get selected(){return current();},get balance(){return wallet.balance();},get items(){return items.map(i=>({...i,owned:owned.has(i.id),equipped:equipped===i.id}));}};
}};
