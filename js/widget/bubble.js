circleMagic=function(e){var n,a,o,i,t=!0,r=[],d=Object.assign({color:"rgba(255,255,255,.5)",radius:10,density:.1,clearOffset:.9},e),c=document.createElement("div");c.id="bubble-cntr",c.style.height=document.body.scrollHeight+"px",document.querySelector("#footer").appendChild(c);const l=document.createElement("style");function s(){t=!(document.body.scrollTop>a)}function h(){n=c.clientWidth,a=c.clientHeight,c.height=a+"px",o.width=n,o.height=a}function f(){if(t)for(var e in i.clearRect(0,0,n,a),r)r[e].draw();requestAnimationFrame(f)}function p(){var o=this;function e(){o.pos.x=Math.random()*n,o.pos.y=a+100*Math.random(),o.alpha=.1+Math.random()*d.clearOffset,o.radius=(.1+.3*Math.random())*d.radius,o.speed=Math.random(),"random"===d.color?o.color="rgba("+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", "+Math.floor(255*Math.random())+", "+Math.random().toPrecision(2)+")":o.color=d.color.replace(".5",""+.5*Math.random().toPrecision(2))}o.pos={},e(),this.draw=function(){o.alpha<=0&&e(),o.pos.y-=o.speed,o.alpha-=5e-4,i.beginPath();let t=0;for(let e=0;e<6;e++)t+=30*Math.sin(.01*o.pos.y+(e+o.pos.x)*o.speed);i.arc(o.pos.x+t,o.pos.y,o.radius+(1-o.alpha)*o.radius*3*Math.max(a-o.pos.y,0)/a,0,2*Math.PI,!1),i.fillStyle=o.color,i.fill(),i.closePath()}}l.innerHTML=`
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
    }`,document.querySelector("head").appendChild(l),function(){n=c.offsetWidth,a=c.offsetHeight,o=document.createElement("canvas"),c.appendChild(o),o.width=n,o.height=a,i=o.getContext("2d");for(var e=0;e<n*d.density;e++){var t=new p;r.push(t)}f()}(),window.addEventListener("scroll",s,!1),window.addEventListener("resize",h,!1)},window.addEventListener("load",function(){circleMagic({})});