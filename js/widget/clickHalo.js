function clickHaloInit(){const t=document.getElementsByClassName("click-halo")[0];document.addEventListener("mousedown",e=>{if(t.classList.contains("ripple"))return;const n=e.pageX,i=e.pageY;t.style.top=`${i-30}px`,t.style.left=`${n-30}px`,t.classList.add("ripple")}),t.addEventListener("animationend",()=>{t.classList.remove("ripple")})}let clickHalo=function(){"ontouchstart"in window||navigator.msMaxTouchPoints||clickHaloInit()};export default clickHalo;