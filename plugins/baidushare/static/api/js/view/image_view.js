window._bd_share_main.F.module("view/image_view",function(e,t,i){var o=e("base/tangram").T,n=e("base/class").Class,s=e("conf/const"),a=e("view/view_base");t.View=n.create(function(e){function t(t){var i=t.target;(function(t){var i=!0;e.bdMinHeight&&e.bdMinHeight>t.offsetHeight?i=!1:e.bdMinWidth&&e.bdMinWidth>t.offsetWidth?i=!1:(t.offsetWidth<100||t.offsetHeight<100)&&(i=!1);return i})(i)&&(d.element=i,d.start())}function i(){d.abort()}function n(t){t&&function(t){if(e.bdCustomStyle){var i=document.createElement("link");i.href=e.bdCustomStyle,i.rel="styleSheet",i.type="text/css",i.onLoad=function(){t&&t()},document.getElementsByTagName("head")[0].appendChild(i)}else window._bd_share_main.F.use(["imgshare.css","share_style0_"+e.viewSize+".css"],function(){t&&t()})}(function(){(function(t){if("list"==e.viewType)for(var i={16:{lbl:53,pright:8,item:18},24:{lbl:57,pright:8,item:28},32:{lbl:61,pright:8,item:38}},n=i[e.viewSize],s=Math.floor((t.offsetWidth-n.lbl-n.pright-10)/n.item),a=h.find(".bdimgshare-icon"),r=0,f=a.length-1;r<f;r++)r<s-1?o(a[r]).show():o(a[r]).hide();var l={width:h.offsetWidth,height:h.offsetHeight},d={width:t.offsetWidth,height:t.offsetHeight},c=function(t,i,o){return"list"==e.viewType?{top:t.top+("bottom"==e.viewPos?i.height-o.height:0),left:t.left}:"collection"==e.viewType?{top:t.top+(e.viewPos.toLowerCase().indexOf("bottom")>-1?i.height-o.height-5:5),left:t.left+(e.viewPos.toLowerCase().indexOf("left")>-1?5:i.width-o.width-5)}:{top:t.top+("bottom"==e.viewPos?i.height-o.height:0),left:t.left+(i.width-o.width)}}(o(t).offset(),d,l),u={position:"absolute",top:c.top+"px",left:c.left+"px"};"list"==e.viewType&&(u.width=d.width+"px"),h.css(u)})(t),h.show(),f=!1,l=t})}var a=this,r="bdimgshare_"+(new Date).getTime(),h=null,f=!1,l=null,d=new function(e){var t=!1,i=!1;this.clearAbort=function(){i&&(i=clearTimeout(i))},this.start=function(){i&&(i=clearTimeout(i)),t||(t=setTimeout(function(){e.startFn&&e.startFn(),t=!1},e.time))},this.abort=function(){t&&(t=clearTimeout(t)),i||(i=setTimeout(function(){e.abortFn&&e.abortFn(),i=!1},e.time))}}({time:200,startFn:function(){n(d.element)},abortFn:function(){f||h.hide()}});a.render=function(n){(function(){var n=e.tag||"";o("img").each(function(e,a){if(!n||o(a).attr(s.CONFIG_TAG_ATTR)==n){if(1==o(a).attr("data-bd-imgshare-binded"))return;o(a).on("mouseenter",t).on("mouseleave",i),o(a).attr("data-bd-imgshare-binded",1)}})})(),function(){var t=["<div id='#{id}' class='sr-bdimgshare sr-bdimgshare-#{type} sr-bdimgshare-#{size} sr-bdimgshare-#{color}' style='height:#{height}px;line-height:#{lineHeight}px;font-size:#{fontSize}px;width:#{width}px;display:none;'>","<div class='bdimgshare-bg'></div>","<div class='bdimgshare-content bdsharebuttonbox bdshare-button-style#{style}-#{size}'>","<label class='bdimgshare-lbl'>#{text}</label>","#{list}","</div>","</div>"].join(""),i="<a href='#' onclick='return false;' class='bds_#{icon}' data-cmd='#{icon}' hidefocus></a>",n="list"==e.viewType,s=[];n&&o.each(e.viewList,function(e,t){s.push(o.string(i).format({icon:t}))}),s.push(o.string(i).format({icon:"more"}));var f={16:"36",24:"42",32:"48"},l={16:"33",24:"39",32:"45"},c=o.string(t).format({id:r,text:e.viewText||(n?"图片分享":"分享"),type:e.viewType,style:e.viewStyle,size:e.viewSize,color:e.viewColor,width:n?"auto":{16:"60",24:"71",32:"82"}[e.viewSize],height:(n?f:l)[e.viewSize],lineHeight:(n?f:l)[e.viewSize]-10,fontSize:{16:"12",24:"14",32:"14"}[e.viewSize],list:s.join("")});o("body").insertHTML("beforeEnd",c),a._entities=h=o("#"+r),h.on("mouseleave",function(){d.abort()}).on("mouseenter",function(){d.clearAbort()})}()},a._init=function(){},a._keepBarVisible=function(){d.clearAbort(),f=!0},a._getImageSrc=function(){return l.src},a._distory=function(){h.remove();var n=e.tag||"";o("img").each(function(e,a){n&&o(a).attr(s.CONFIG_TAG_ATTR)!=n||(o(a).off("mouseenter",t).off("mouseleave",i),o(a).removeAttr("data-bd-imgshare-binded"))})}},a.ViewBase)});