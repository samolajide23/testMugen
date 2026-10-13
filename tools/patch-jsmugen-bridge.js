"use strict";

const fs = require("fs");
const path = require("path");

const bundlePath = path.join(__dirname, "..", "vendor", "jsmugen", "bundle.js");
let s = fs.readFileSync(bundlePath, "utf8");

// Always start from a clean upstream-like ending if we re-patch
if (s.includes("window.JSMugenBridge")) {
  const cut = s.indexOf("\nwindow.JSMugenBridge=");
  const cut2 = s.indexOf("window.JSMugenBridge=");
  const at = cut >= 0 ? cut : cut2;
  if (at > 0) {
    const marker = "performance.now()})()})();";
    const end = s.lastIndexOf(marker);
    if (end > at) s = s.slice(0, at) + marker;
  }
}

if (s.includes("window.JSMugenBridge")) {
  console.log("bridge already present (could not strip)");
  process.exit(0);
}

const marker = "performance.now()})()})();";
const i = s.lastIndexOf(marker);
if (i < 0) {
  console.error("marker not found in bundle.js");
  process.exit(1);
}

const bridge = `
window.JSMugenBridge={
  getGame:()=>h,
  ready:()=>!!(h&&h.p1),
  loadBlob:async(blob)=>{const data=await g(blob);if(data){k(data,"P1");return true;}return false;},
  clearCompareLock:()=>{
    const p=h&&h.p1; if(!p) return;
    if(p._mugenSkelProcess){ p._processCurrentState=p._mugenSkelProcess; p._mugenSkelProcess=null; }
    p._compareLockAnim=null;
  },
  changeAction:(actionId)=>{
    if(!(h&&h.p1)) return false;
    const id=Number(actionId);
    if(Number.isNaN(id)) return false;
    try{
      const p=h.p1;
      if(!p._mugenSkelProcess && typeof p._processCurrentState==="function"){
        p._mugenSkelProcess=p._processCurrentState.bind(p);
        p._processCurrentState=function(){};
      }
      p.ctrl=0;
      p._compareLockAnim=id;
      p.changeAction(id);
      return true;
    }catch(e){ console.warn("changeAction",e); return false; }
  },
  reset:()=>{
    try{ window.JSMugenBridge.clearCompareLock(); }catch(_){}
    if(h){ try{ h.roundstart(1); }catch(_){ } }
  },
  setDrawClsn:(on)=>{ if(h) h.drawclbox=!!on; },
  /** AIR actions with Clsn — same parse path JSMugen uses to play chars. */
  extractAir:()=>{
    const p=h&&h.p1; if(!p||!p.AIR) return null;
    const normClsn=(c)=>{
      if(!c||!c.length) return [];
      const out=[];
      for(const b of c){
        if(!b) continue;
        if(Array.isArray(b) && b.length>=4) out.push({x1:+b[0],y1:+b[1],x2:+b[2],y2:+b[3]});
        else if(typeof b==="object" && b.x1!=null) out.push({x1:+b.x1,y1:+b.y1,x2:+b.x2,y2:+b.y2});
      }
      return out;
    };
    const actions={};
    const list=(typeof p.AIR.getList==="function")?p.AIR.getList():[];
    for(const action of list){
      const els=(action&&typeof action.getElement==="function")?action.getElement():(action&&action._elements)||[];
      const frames=[];
      for(const el of els){
        if(!el) continue;
        let ticks=Number(el.ticks);
        if(ticks<0) ticks=8;
        if(ticks===0) ticks=1;
        frames.push({
          group:Number(el.group),
          image:Number(el.index),
          xoff:Number(el.x)||0,
          yoff:Number(el.y)||0,
          ticks,
          flipH:!!el.flipH,
          flipV:!!el.flipV,
          clsn1:normClsn(el.clsn1),
          clsn2:normClsn(el.clsn2),
        });
      }
      if(frames.length) actions[String(action.number)]=frames;
    }
    let name="char";
    try{
      if(p.DEF&&typeof p.DEF.get==="function") name=p.DEF.get("info","name")||name;
    }catch(_){}
    return { name, actions, actionCount:Object.keys(actions).length };
  },
  /**
   * Decode sprites via JSMugen SFFLoader (palette/axis/transparency).
   * keys: ["group_index", ...] — omit to export every subfile (heavy).
   * Returns { sprites: { key: { width,height,x,y,rgba:ArrayBuffer } }, transfer: ArrayBuffer[] }
   */
  extractSprites:(keys)=>{
    const p=h&&h.p1; if(!p||!p.SFF) return { sprites:{}, transfer:[] };
    const sff=p.SFF;
    const want=keys&&keys.length?new Set(keys.map(String)):null;
    const sprites={};
    const transfer=[];
    const pushOne=(group,index)=>{
      const key=group+"_"+index;
      if(want&&!want.has(key)) return;
      if(sprites[key]) return;
      let data=null;
      try{ data=sff.getAsImageData(group,index); }catch(e){ return; }
      if(!data) return;
      let canvas=data.img;
      if(!canvas&&data.imageData){
        canvas=document.createElement("canvas");
        canvas.width=data.imageData.width;
        canvas.height=data.imageData.height;
        canvas.getContext("2d").putImageData(data.imageData,0,0);
      }
      if(!canvas||!canvas.width) return;
      const ctx=canvas.getContext("2d");
      const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
      const copy=imageData.data.buffer.slice(
        imageData.data.byteOffset,
        imageData.data.byteOffset+imageData.data.byteLength
      );
      sprites[key]={
        width:canvas.width,
        height:canvas.height,
        x:data.axisX|0,
        y:data.axisY|0,
        rgba:copy,
      };
      transfer.push(copy);
    };
    if(want){
      for(const key of want){
        const parts=String(key).split("_");
        if(parts.length<2) continue;
        pushOne(Number(parts[0]), Number(parts[1]));
      }
    }else{
      const subs=(typeof sff.getSubfileByIndex==="function")?sff.getSubfileByIndex():[];
      for(const sub of subs){
        if(!sub) continue;
        pushOne(sub.group, sub.imgNumber!=null?sub.imgNumber:sub.index);
      }
    }
    return { sprites, transfer };
  },
};
try{ window.parent&&window.parent.postMessage({type:"jsmugen-ready"},"*"); }catch(_){}
`;

s = s.slice(0, i) + bridge + marker;
fs.writeFileSync(bundlePath, s);
console.log("patched JSMugen bridge into", bundlePath);
