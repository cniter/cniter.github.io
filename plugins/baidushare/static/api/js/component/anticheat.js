window._bd_share_main.F.module("component/anticheat",function(t,e,a){var u,v,h=t("base/tangram").T,i=function(t,e){var a=h(e).offset(),e=t.pageX,t=t.pageY;return{left:Math.floor(e-a.left),top:Math.floor(t-a.top)}};e.process=function(t,e,a){var o,n;"mouseenter"==t?(o=e,n=a,void 0===u&&(u=Math.floor(o.pageX),v=Math.floor(o.pageY)),n&&(o=i(o,n),h(n).data("over_x",o.left).data("over_y",o.top).data("over_time",+new Date))):"mouseclick"==t&&function(t,e){t=i(t,e);h(e).data("click_x",t.left).data("click_y",t.top)}(e,a)},e.getSloc=function(t){var e=h(t.__element),a=t.__buttonType,o=e.data("over_x")||0,n=e.data("over_y")||0,i=e.data("click_x"),r=e.data("click_y"),c=e.innerWidth(),d=e.innerHeight(),f=new Date-e.data("over_time"),l=document.body.offsetWidth,_=document.body.offsetHeight,t=window.screen.availWidth,e=window.screen.availHeight;return[u,v,0<a?1:0,o,n,i,r,c,d,a,f,l,_,t,e].join(".")}});