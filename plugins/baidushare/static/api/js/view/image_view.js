window._bd_share_main.F.module("view/image_view",function(e,t,i){var l=e("base/tangram").T,o=e("base/class").Class,s=e("conf/const"),e=e("view/view_base");t.View=o.create(function(r){function o(e){e=e.target;!function(e){var t=!0;(r.bdMinHeight&&r.bdMinHeight>e.offsetHeight||r.bdMinWidth&&r.bdMinWidth>e.offsetWidth||e.offsetWidth<100||e.offsetHeight<100)&&(t=!1);return t}(e)||(d.element=e,d.start())}function n(){d.abort()}function e(e){e&&function(e){{var t;r.bdCustomStyle?((t=document.createElement("link")).href=r.bdCustomStyle,t.rel="styleSheet",t.type="text/css",t.onLoad=function(){e&&e()},document.getElementsByTagName("head")[0].appendChild(t)):window._bd_share_main.F.use(["imgshare.css","share_style0_"+r.viewSize+".css"],function(){e&&e()})}}(function(){(function(e){if("list"==r.viewType)for(var t={16:{lbl:53,pright:8,item:18},24:{lbl:57,pright:8,item:28},32:{lbl:61,pright:8,item:38}}[r.viewSize],i=Math.floor((e.offsetWidth-t.lbl-t.pright-10)/t.item),o=f.find(".bdimgshare-icon"),n=0,s=o.length-1;n<s;n++)n<i-1?l(o[n]).show():l(o[n]).hide();var a={width:f.offsetWidth,height:f.offsetHeight},t={width:e.offsetWidth,height:e.offsetHeight},a=function(e,t,i){return"list"==r.viewType?{top:e.top+("bottom"==r.viewPos?t.height-i.height:0),left:e.left}:"collection"==r.viewType?{top:e.top+(-1<r.viewPos.toLowerCase().indexOf("bottom")?t.height-i.height-5:5),left:e.left+(-1<r.viewPos.toLowerCase().indexOf("left")?5:t.width-i.width-5)}:{top:e.top+("bottom"==r.viewPos?t.height-i.height:0),left:e.left+(t.width-i.width)}}(l(e).offset(),t,a),a={position:"absolute",top:a.top+"px",left:a.left+"px"};"list"==r.viewType&&(a.width=t.width+"px"),f.css(a)})(e),f.show(),t=!1,i=e})}var a=this,h="bdimgshare_"+(new Date).getTime(),f=null,t=!1,i=null,d=new function(e){var t=!1,i=!1;this.clearAbort=function(){i=i&&clearTimeout(i)},this.start=function(){i=i&&clearTimeout(i),t=t||setTimeout(function(){e.startFn&&e.startFn(),t=!1},e.time)},this.abort=function(){t=t&&clearTimeout(t),i=i||setTimeout(function(){e.abortFn&&e.abortFn(),i=!1},e.time)}}({time:200,startFn:function(){e(d.element)},abortFn:function(){t||f.hide()}});a.render=function(e){var i;i=r.tag||"",l("img").each(function(e,t){i&&l(t).attr(s.CONFIG_TAG_ATTR)!=i||1!=l(t).attr("data-bd-imgshare-binded")&&(l(t).on("mouseenter",o).on("mouseleave",n),l(t).attr("data-bd-imgshare-binded",1))}),function(){var e=["<div id='#{id}' class='sr-bdimgshare sr-bdimgshare-#{type} sr-bdimgshare-#{size} sr-bdimgshare-#{color}' style='height:#{height}px;line-height:#{lineHeight}px;font-size:#{fontSize}px;width:#{width}px;display:none;'>","<div class='bdimgshare-bg'></div>","<div class='bdimgshare-content bdsharebuttonbox bdshare-button-style#{style}-#{size}'>","<label class='bdimgshare-lbl'>#{text}</label>","#{list}","</div>","</div>"].join(""),i="<a href='#' onclick='return false;' class='bds_#{icon}' data-cmd='#{icon}' hidefocus></a>",t="list"==r.viewType,o=[];t&&l.each(r.viewList,function(e,t){o.push(l.string(i).format({icon:t}))}),o.push(l.string(i).format({icon:"more"}));var n={16:"36",24:"42",32:"48"},s={16:"33",24:"39",32:"45"},s=l.string(e).format({id:h,text:r.viewText||(t?"图片分享":"分享"),type:r.viewType,style:r.viewStyle,size:r.viewSize,color:r.viewColor,width:t?"auto":{16:"60",24:"71",32:"82"}[r.viewSize],height:(t?n:s)[r.viewSize],lineHeight:(t?n:s)[r.viewSize]-10,fontSize:{16:"12",24:"14",32:"14"}[r.viewSize],list:o.join("")});l("body").insertHTML("beforeEnd",s),a._entities=f=l("#"+h),f.on("mouseleave",function(){d.abort()}).on("mouseenter",function(){d.clearAbort()})}()},a._init=function(){},a._keepBarVisible=function(){d.clearAbort(),t=!0},a._getImageSrc=function(){return i.src},a._distory=function(){f.remove();var i=r.tag||"";l("img").each(function(e,t){i&&l(t).attr(s.CONFIG_TAG_ATTR)!=i||(l(t).off("mouseenter",o).off("mouseleave",n),l(t).removeAttr("data-bd-imgshare-binded"))})}},e.ViewBase)});