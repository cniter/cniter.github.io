window._bd_share_main.F.module("view/select_view",function(e,t,a){var n,s,i,r,o=e("base/tangram").T,d=e("base/class").Class,c=(e("conf/const"),e("view/view_base")),l=function(e){var t="";return t=document.selection?document.selection.createRange().text:document.getSelection(),o.string(t.toString()).trim()},h="getSelection"in document?function(){document.getSelection().removeAllRanges(),r=""}:function(){document.selection.empty(),r=""};t.View=d.create(function(e){function t(e,t){var d=function(e,t){var a=e.pageY,s=e.pageX;a+=5,s-=18;var i=n.outerHeight(),r=o(window).scrollTop();(a+i>o("body").height()&&a+i>o(window).height()||a+i>r+o(window).height())&&(a=e.pageY-i-5,a=a<r?r:a);var d=t.bdPopupOffsetLeft,c=t.bdPopupOffsetTop;return(d||c)&&(a+=0|c,s+=0|d),{top:a,left:s}}(e,t);if(r.length<5)a.hide("less");else{o.each([n,s],function(e,a){a.css({top:d.top,left:d.left}).show(),t.bdText=l()});var c=i.find("a").length,h=o(i.find("a")).outerWidth(!0)*c+20,_=parseInt(n.css("max-width"));_&&h>_&&(h=_),n.width(h),n.find(".bdselect_share_head").width(h),s.width(h),s.height(n.height());var p=n.find(".bdselect_share_dialog_search");p.attr("href","http://www.baidu.com/s?wd="+t.bdText+"&tn=SE_hldp08010_vurs2xrp");var f=b(function(){u("http://s.share.baidu.com/select?"+o.ajax.param({log_type:"click",content:encodeURIComponent(t.bdText)}))},100);p.click(f),h<220?n.find(".bdselect_share_dialog_search_span").hide():n.find(".bdselect_share_dialog_search_span").show(),u("http://s.share.baidu.com/select?"+o.ajax.param({log_type:"show",content:encodeURIComponent(t.bdText)}))}}var a=this;a._container=null;var d=e.bdStyle||0,c="|16|24|32|".indexOf("|"+e.bdSize+"|")>-1?e.bdSize:16,_=!1;a._buttonType=0,a.render=function(){var t="bdSharePopup_selectshare"+ +new Date,r=['<iframe frameborder="0" id="'+t+'bg" class="bdselect_share_bg" style="display:none;"></iframe>'].join(""),l=['<div id="'+t+'box" style="display:none;" share-type="selectshare" class="bdselect_share_box">','<div class="selectshare-mod-triangle"><div class="triangle-border"></div><div class="triangle-inset"></div></div>','<div  class="bdselect_share_head" ><span>分享到</span>','<a href="http://www.baidu.com/s?wd='+e.bdText+'&tn=SE_hldp08010_vurs2xrp"',' class="bdselect_share_dialog_search" target="_blank">','<i class="bdselect_share_dialog_search_i"></i>','<span class="bdselect_share_dialog_search_span">百度一下</span></a>','<a class="bdselect_share_dialog_close"></a></div>','<div class="bdselect_share_content" >','<ul class="bdselect_share_list">','<div class="bdselect_share_partners"></div>','<a href="#" class="bds_more"  data-cmd="more"></a>',"</ul>","</div>","</div>"].join("");o("body").insertHTML("beforeEnd",r+l),a._container=n=o("#"+t+"box"),i=n.find(".bdselect_share_list").addClass("bdshare-button-style"+d+"-"+c),s=o("#"+t+"bg"),a._entities.push(n),o(".bdselect_share_dialog_close").click(a.hide)},a.hide=function(e){e||h(),s&&s.hide(),n&&n.hide()},a._init=function(){var t;t=e.bdContainerClass?o("."+e.bdContainerClass):o("body").children(),o("body").on("mouseup",function(s){t.each(function(t,i){i==s.target||o(i).contains(s.target)||!e.bdContainerClass&&s.target==document.body?setTimeout(function(){r=l(),function(){if(e.bdCustomStyle){var t=document.createElement("link");t.href=e.bdCustomStyle,t.rel="styleSheet",t.type="text/css",document.getElementsByTagName("head")[0].appendChild(t)}else window._bd_share_main.F.use("share_style"+d+"_"+c+".css")}(),a.show(s,e)},10):"block"==n.css("display")&&a.hide()})})},a.show=function(e,n){window._bd_share_main.F.use(["component/partners","share_popup.css","select_share.css"],function(s){a._partnerSort=s.partnerSort,_||(function(e,t){t.bdMini;var n=t.bdSelectMiniList||a._partnerSort.slice(0,4),s=[];o.each(n,function(e,t){s[e]='<a href="#" class="bds_'+t+'" data-cmd="'+t+'"></a>'}),i.find(".bdselect_share_partners").html(s.join(""))}(a._container,n),_=!0),t(e,n)})};var u=function(){var e={};return function(t){var a="bdsharelog__"+(new Date).getTime(),n=e[a]=new Image;n.onload=n.onerror=function(){e[a]=null},n.src=t+"&t="+(new Date).getTime(),n=null}}(),b=function(e,t,a){var n,s,i,r=null,o=0;a||(a={});var d=function(){o=!1===a.leading?0:new Date,r=null,i=e.apply(n,s),r||(n=s=null)};return function(){var c=new Date;!o&&!1===a.leading&&(o=c);var l=t-(c-o);return n=this,s=arguments,l<=0||l>t?(clearTimeout(r),r=null,o=c,i=e.apply(n,s),r||(n=s=null)):!r&&!1!==a.trailing&&(r=setTimeout(d,l)),i}};a._distory=function(){n.remove(),s.remove()}},c.ViewBase)});