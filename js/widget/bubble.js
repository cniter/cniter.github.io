circleMagic=function(e){var t,n,a,i,o=!0,r=[],d=Object.assign({color:"rgba(255,255,255,.5)",radius:10,density:.1,clearOffset:.9},e),c=document.createElement("div");c.id="bubble-cntr",c.style.height=document.body.scrollHeight+"px",document.querySelector("#footer").appendChild(c);const l=document.createElement("style");function s(){o=!(document.body.scrollTop>n)}function h(){t=c.clientWidth,n=c.clientHeight,c.height=n+"px",a.width=t,a.height=n}function p(){if(o)for(var e in i.clearRect(0,0,t,n),r)r[e].draw();requestAnimationFrame(p)}function f(){var e=this;function o(){e.pos.x=Math.random()*t,e.pos.y=n+100*Math.random(),e.alpha=.1+Math.random()*d.clearOffset,e.radius=(.1+.3*Math.random())*d.radius,e.speed=Math.random(),"random"===d.color?e.color="rgba("+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", "+Math.random().toPrecision(2)+")":e.color=d.color.replace(".5",""+.5*Math.random().toPrecision(2))}e.pos={},o(),this.draw=function(){e.alpha<=0&&o(),e.pos.y-=e.speed,e.alpha-=5e-4,i.beginPath(),i.arc(e.pos.x+60*Math.sin(.01*e.pos.y+e.pos.x*e.speed),e.pos.y,e.radius+(1-e.alpha)*e.radius*3*Math.max(n-e.pos.y,0)/n,0,2*Math.PI,!1),i.fillStyle=e.color,i.fill(),i.closePath()}}l.innerHTML=`
    #footer {
        position: relative;
    }
    #bubble-cntr {
        position: absolute;
        width: 100%;
        overflow: hidden;
        left: 0;
        bottom: 0;
        z-index: -1;
        pointer-events: none;
    }`,document.querySelector("head").appendChild(l),function(){t=c.offsetWidth,n=c.offsetHeight,console.log(n),a=document.createElement("canvas"),c.appendChild(a),a.width=t,a.height=n,i=a.getContext("2d");for(var e=0;e<t*d.density;e++){var o=new f;r.push(o)}p()}(),window.addEventListener("scroll",s,!1),window.addEventListener("resize",h,!1)},window.addEventListener("load",function(){circleMagic({})});