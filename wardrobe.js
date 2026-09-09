/* Saved cosmetic balance + ownership are committed in one versioned record. */
window.PipWardrobe={create({storage,wallet,changed=()=>{}}){
  const cat=PipCosmetics,key='wordwind_wardrobe_v2',free=cat.items.filter(i=>!i.cost).map(i=>i.id);
  let preview=null,selected='auto',selection=0,pending=false,error='';
  const read=(k,f)=>{try{return JSON.parse(storage.getItem(k))??f;}catch{return f;}};
  const validBalance=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0;
  function normalise(raw){
    const owned=new Set([...free,...(Array.isArray(raw?.owned)?raw.owned:[]).filter(id=>cat.byId[id])]);
    const sanitise=l=>{const look=cat.clean(l);for(const slot in look)if(!owned.has(look[slot]))look[slot]=cat.defaults[slot];return look;};
    return {version:2,revision:Number.isSafeInteger(raw?.revision)?raw.revision:0,balance:validBalance(raw?.balance)?raw.balance:Math.max(0,Number(wallet.balance())||0),owned:[...owned],equipped:sanitise(raw?.equipped),presets:Array.from({length:3},(_,i)=>raw?.presets?.[i]?sanitise(raw.presets[i]):null),lastAward:typeof raw?.lastAward==='string'?raw.lastAward:''};
  }
  const old=read('wordwind_wardrobe_v1',{}),saved=read(key,null),legacyOwned=Array.isArray(old.owned)?old.owned:[],effects=read('wordwind_cosmetics',[]);
  let state=normalise(saved?.version===2?saved:{balance:wallet.balance(),owned:[...legacyOwned,...(Array.isArray(effects)?effects:[])],equipped:{...cat.defaults,outfit:legacyOwned.includes(old.equipped)?old.equipped:'auto',glow:read('wordwind_glow','')||'no-glow',chime:read('wordwind_chime',false)?'chime':'no-chime'}});
  function publish(){wallet.sync?.(state.balance);changed();}
  function save(next){next.revision=state.revision+1;try{storage.setItem(key,JSON.stringify(next));}catch{error='This device could not save. Nothing was purchased.';return false;}state=next;try{storage.setItem('wordwind_coins',JSON.stringify(state.balance));}catch{}error='';return true;}
  if(saved?.version!==2){try{storage.setItem(key,JSON.stringify(state));}catch{error='Saving is unavailable on this device.';}}wallet.sync?.(state.balance);
  function refreshState(){const raw=read(key,null);if(raw?.version===2)state=normalise(raw);}
  const lock=fn=>globalThis.navigator?.locks?.request?globalThis.navigator.locks.request('windwords-cosmetics',fn):Promise.resolve().then(fn);
  function ownedLook(look,extra){const next=cat.clean(look);for(const slot in next)if(!state.owned.includes(next[slot])&&next[slot]!==extra)next[slot]=state.equipped[slot];return next;}
  const current=()=>preview||state.equipped;
  const api={
    open(){preview={...state.equipped};selected=preview.head;selection++;publish();},close(){preview=null;selection++;error='';publish();},
    select(id){if(!cat.byId[id])return false;selected=id;preview=cat.withItem(current(),id);selection++;error='';publish();return true;},
    async buyOrEquip(){
      if(pending)return false;const id=selected,item=cat.byId[id],intent=selection;if(!item)return false;pending=true;error='';publish();
      try{await globalThis.PipAppearance?.compose(ownedLook(current(),id));if(intent!==selection){error='Choose Wear for the new selection.';return false;}
        return await lock(()=>{refreshState();if(intent!==selection)return false;const cost=state.owned.includes(id)?0:item.cost;if(state.balance<cost){error=`Need ${cost-state.balance} more stars.`;return false;}const next=normalise({...state,owned:[...state.owned,id],balance:state.balance-cost,equipped:ownedLook(current(),id)});if(!save(next))return false;preview={...state.equipped};return true;});
      }catch{error='This look could not load. No stars were spent.';return false;}finally{pending=false;publish();}
    },
    async earn(amount,awardId=''){if(!Number.isFinite(amount)||amount<=0)return false;const ok=await lock(()=>{refreshState();if(awardId&&state.lastAward===awardId)return true;return save({...state,balance:state.balance+amount,lastAward:awardId||state.lastAward});});publish();return ok;},
    async reset(){await lock(()=>{refreshState();save({...state,equipped:{...cat.defaults}});});preview={...state.equipped};selected='auto';selection++;publish();},
    async savePreset(index){if(index<0||index>2)return false;if(Object.values(current()).some(id=>!state.owned.includes(id))){error='Wear or buy the previewed pieces before saving a look.';publish();return false;}const look={...current()};const ok=await lock(()=>{refreshState();if(Object.values(look).some(id=>!state.owned.includes(id)))return false;const presets=[...state.presets];presets[index]=look;return save({...state,presets});});publish();return ok;},
    async wearPreset(index){const look=state.presets[index];if(!look)return false;try{await globalThis.PipAppearance?.compose(look);}catch{error='This look could not load.';publish();return false;}const ok=await lock(()=>{refreshState();return save({...state,equipped:ownedLook(look)});});preview={...state.equipped};selection++;publish();return ok;},
    refresh(){refreshState();publish();},get selected(){return selected;},get look(){return {...current()};},get equipped(){return {...state.equipped};},get balance(){return state.balance;},get busy(){return pending;},get error(){return error;},get presets(){return state.presets.map(p=>p?{...p}:null);},get art(){return cat.byId[state.equipped.outfit]?.art||null;},get items(){return cat.items.map(i=>({...i,owned:state.owned.includes(i.id),equipped:state.equipped[i.slot]===i.id}));}
  };
  globalThis.addEventListener?.('storage',e=>{if(e.key===key){refreshState();publish();}});return api;
}};
