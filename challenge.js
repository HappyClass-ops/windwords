/* Reversible coordinator defaults; Learning stays gentle, no new word banks. */
window.PipChallenge={checkpoint(mode,phase,stage=0){
 if(mode!=='classic'||phase!==5)return {count:5,right:phase===5?3:2,stages:1,label:'Restore the beacon'};
 return [{count:5,right:2,stages:3,label:'Identify the naming words',kind:'noun'},{count:6,right:2,stages:3,label:'Find the action words',kind:'verb'},{count:6,right:3,stages:3,label:'Clear the last wordwind',kind:'adjective'}][Math.max(0,Math.min(2,stage))];
}};
