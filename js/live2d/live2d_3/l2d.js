class L2D{constructor(e){this.basePath=e,this.loader=new PIXI.loaders.Loader(this.basePath),this.animatorBuilder=new LIVE2DCUBISMFRAMEWORK.AnimatorBuilder,this.timeScale=1,this.models={}}setPhysics3Json(e){return this.physicsRigBuilder||(this.physicsRigBuilder=new LIVE2DCUBISMFRAMEWORK.PhysicsRigBuilder),this.physicsRigBuilder.setPhysics3Json(e),this}load(R,u){if(this.models[R])u.changeCanvas(this.models[R]);else{let r=R+"/";var e=(R=R.split("/").pop())+".model3.json";let c=new Array,h=0,n=new Array;this.loader.add(R+"_model",r+e,{xhrType:PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON}),this.loader.load((i,e)=>{let s=e[R+"_model"].data;if(void 0!==s.FileReferences.Moc&&i.add(R+"_moc",r+s.FileReferences.Moc,{xhrType:PIXI.loaders.Resource.XHR_RESPONSE_TYPE.BUFFER}),void 0!==s.FileReferences.Textures&&s.FileReferences.Textures.forEach(e=>{i.add(R+"_texture"+h,r+e),h++}),void 0!==s.FileReferences.Physics&&i.add(R+"_physics",r+s.FileReferences.Physics,{xhrType:PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON}),void 0!==s.FileReferences.Motions)for(var o in s.FileReferences.Motions)s.FileReferences.Motions[o].forEach(e=>{var s=e.File.split("/").pop().split(".").shift();i.add(R+"_"+s,r+e.File,{xhrType:PIXI.loaders.Resource.XHR_RESPONSE_TYPE.JSON}),n.push(R+"_"+s)});let d=null;s.Groups,d=LIVE2DCUBISMFRAMEWORK.Groups.fromModel3Json(s),i.load((e,i)=>{let s=null;if(void 0!==i[R+"_moc"]&&(s=Live2DCubismCore.Moc.fromArrayBuffer(i[R+"_moc"].data)),void 0!==i[R+"_texture0"])for(let e=0;e<h;e++)c.splice(e,0,i[R+"_texture"+e].texture);void 0!==i[R+"_physics"]&&this.setPhysics3Json(i[R+"_physics"].data);let o=new Map;n.forEach(e=>{var s=e.split(R+"_").pop();o.set(s,LIVE2DCUBISMFRAMEWORK.Animation.fromMotion3Json(i[e].data))});let r=null;var t,l,a=Live2DCubismCore.Model.fromMoc(s);null!=a&&(t=this.animatorBuilder.setTarget(a).setTimeScale(this.timeScale).build(),l=this.physicsRigBuilder.setTarget(a).setTimeScale(this.timeScale).build(),r=LIVE2DCUBISMPIXI.Model._create(a,c,t,l,null,d),r.motions=o,this.models[R]=r,u.changeCanvas(r))})})}}}