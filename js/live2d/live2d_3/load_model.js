var v;$(document).ready(()=>{v=new Viewer("live2d_models/live2d_3"),setTimeout(()=>{$(".live2d_3").css("bottom","300px")},0)});var modelMotionData={dafeng_2:{ArtMesh46:["wedding"],ArtMesh48:["wedding"],bosha:["home"],yingying:["home"],ArtMesh52:["home"],houfasi:["complete"],mawei2:["complete"],mawei1:["complete"],yocefa:["complete"],neiku:["mission","login"],ArtMesh62:["mission","login"],ArtMesh75:["main_3"],opshui:["mission_complete","main_2"],ArtMesh42:["mission_complete","main_2"],diaodai1:["mission_complete","main_2"],ArtMesh77:["mail","touch_special"],ArtMesh51:["touch_body"],TouchHead:["touch_head"],TouchSpecial:["touch_special","mail"],TouchBody:["touch_body","main_1","main_2","main_3"]},shengluyisi_3:{youxiaotui4:["wedding","main_1","main_3"],youtui:["complete","wedding","main_1","main_3"],youtui4:["complete","wedding","main_1","main_3"],zuodatui:["touch_special","wedding"],zuodatui2:["touch_special","wedding"],youneichen2:["mail","main_2","touch_special"],zuoOPyifu2:["main_2","mission","mission_complete","touch_special"],TouchHead:["touch_head"],TouchSpecial:["touch_special","mail"],sangu5:["home","mission","mission_complete","login"],TouchBody:["touch_body","main_1","main_2","main_3"]}};class Viewer{constructor(e){var i=Object.keys(modelMotionData);this.modelName=i[Math.floor(Math.random()*i.length)],this.l2d=new L2D(e),this.l2d.load(this.modelName,this),this.canvas=$(".live2d_3-canvas"),this.app=new PIXI.Application({width:800,height:800,transparent:!0,antialias:!0,resolution:3});this.app.view.style.width="300px",this.app.view.style.height="300px",this.app.renderer.resize(300,300),this.canvas.html(this.app.view),this.app.ticker.add(e=>{this.model&&(this.model.update(e),this.model.masks.update(this.app.renderer))}),window.onresize=e=>{void 0===e&&(e=null);this.app.view.style.width="300px",this.app.view.style.height="300px",this.app.renderer.resize(300,300),this.model&&(this.model.position=new PIXI.Point(150,150),this.model.scale=new PIXI.Point(.12*this.model.position.x,.12*this.model.position.x),this.model.masks.resize(this.app.view.width,this.app.view.height)),this.model.height<=200&&(this.model.scale=new PIXI.Point(.6*this.model.position.x,.6*this.model.position.x))},this.isClick=!1,this.app.view.addEventListener("mousedown",e=>{this.isClick=!0}),this.app.view.addEventListener("mousemove",e=>{var i;this.isClick&&(this.isClick=!1,this.model&&(this.model.inDrag=!0)),this.model&&(i=this.model.position.x-e.offsetX,e=this.model.position.y-e.offsetY,this.model.pointerX=-i/this.app.view.height,this.model.pointerY=-e/this.app.view.width)}),this.app.view.addEventListener("mouseup",i=>{if(this.model){if(this.isClick){var t,s,a=modelMotionData[this.modelName];let e=!1;for(t of Object.keys(a))if(this.isHit(t,i.offsetX,i.offsetY)){var o=a[t],o=o[Math.floor(Math.random()*o.length)];this.startAnimation(o,"base"),e=!0;break}e||(s=(s=["complete","home","login","mail","main_1","main_2","main_3","mission_complete","mission","touch_body","touch_head","touch_special","wedding"])[Math.floor(Math.random()*s.length)],this.startAnimation(s,"base"))}this.isClick=!1,this.model.inDrag=!1}})}changeCanvas(e){this.app.stage.removeChildren(),this.model=e,this.model.update=this.onUpdate,this.model.animator.addLayer("base",LIVE2DCUBISMFRAMEWORK.BuiltinAnimationBlenders.OVERRIDE,1),this.app.stage.addChild(this.model),this.app.stage.addChild(this.model.masks),window.onresize(),this.startAnimation("login","base")}onUpdate(e){var i=.016*e;this.animator.isPlaying||(e=this.motions.get("idle"),this.animator.getLayer("base").play(e)),this._animator.updateAndEvaluate(i),this.inDrag&&(this.addParameterValueById("ParamAngleX",30*this.pointerX),this.addParameterValueById("ParamAngleY",30*-this.pointerY),this.addParameterValueById("ParamBodyAngleX",10*this.pointerX),this.addParameterValueById("ParamBodyAngleY",10*-this.pointerY),this.addParameterValueById("ParamEyeBallX",this.pointerX),this.addParameterValueById("ParamEyeBallY",-this.pointerY)),this._physicsRig&&this._physicsRig.updateAndEvaluate(i),this._coreModel.update();let t=!1;for(let e=0;e<this._meshes.length;++e)this._meshes[e].alpha=this._coreModel.drawables.opacities[e],this._meshes[e].visible=Live2DCubismCore.Utils.hasIsVisibleBit(this._coreModel.drawables.dynamicFlags[e]),Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(this._coreModel.drawables.dynamicFlags[e])&&(this._meshes[e].vertices=this._coreModel.drawables.vertexPositions[e],this._meshes[e].dirtyVertex=!0),Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(this._coreModel.drawables.dynamicFlags[e])&&(t=!0);t&&this.children.sort((e,i)=>{e=this._meshes.indexOf(e),i=this._meshes.indexOf(i);return this._coreModel.drawables.renderOrders[e]-this._coreModel.drawables.renderOrders[i]}),this._coreModel.drawables.resetDynamicFlags()}startAnimation(i,t){if(this.model){i=this.model.motions.get(i);if(i){let e=this.model.animator.getLayer(t);e&&e.play(i)}}}isHit(e,i,t){if(!this.model)return!1;e=this.model.getModelMeshById(e);if(!e)return!1;var s=e.vertices;let a=s[0],o=s[0],h=s[1],d=s[1];for(let e=1;e<s.length/2;++e){var l=s[0+2*e],n=s[0+2*e+1];l<a&&(a=l),l>o&&(o=l),n<h&&(h=n),n>d&&(d=n)}i=e.worldTransform.tx-i,t=e.worldTransform.ty-t,i=-i/e.worldTransform.a,e=-t/e.worldTransform.d;return a<=i&&i<=o&&h<=e&&e<=d}buildMeshShape(e){$(".point-div").remove();var i=e.worldTransform,t=e.vertices;console.log("vertices.length:",t.length);for(let e=0;e<t.length/2;++e){var s=t[0+2*e],a=t[0+2*e+1],o=i.a*s+i.c*a+i.tx,a=i.b*s+i.d*a+i.ty;console.log(e,o,a);const h=document.createElement("div");h.classList.add("point-div"),h.style.left=o-2.5+"px",h.style.top=a-2.5+"px",this.canvas.append($(h))}}}