const config={SIM_RESOLUTION:128,DYE_RESOLUTION:1440,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:3.5,VELOCITY_DISSIPATION:2,PRESSURE:.1,PRESSURE_ITERATIONS:20,CURL:3,SPLAT_RADIUS:.2,SPLAT_FORCE:6e3,SHADING:!0,COLOR_UPDATE_SPEED:10,BACK_COLOR:{r:.5,g:0,b:0},TRANSPARENT:!0,PAUSED:!1};function initFluidCursor(){const e=document.createElement("style");e.innerHTML=`
    #fluid-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 50;
        pointer-events: none;
        width: 100%;
        height: 100%;
    }
    
    #fluid {
        width: 100vw;
        height: 100vh;
        display: block;
    }`,document.querySelector("head").appendChild(e);const r=document.createElement("div");r.id="fluid-container",document.body.appendChild(r);const d=document.createElement("canvas");if(d.id="fluid",r.appendChild(d),d){let o=!0,n=null,a=[new function(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[0,0,0]}];const{gl:H,ext:V}=function(e){var r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t=e.getContext("webgl2",r);var i=!!t;i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let o,n;n=i?(t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear")):(o=t.getExtension("OES_texture_half_float"),t.getExtension("OES_texture_half_float_linear"));t.clearColor(0,0,0,1);r=i?t.HALF_FLOAT:o&&o.HALF_FLOAT_OES;let a,u,c;c=i?(a=A(t,t.RGBA16F,t.RGBA,r),u=A(t,t.RG16F,t.RG,r),A(t,t.R16F,t.RED,r)):(a=A(t,t.RGBA,t.RGBA,r),u=A(t,t.RGBA,t.RGBA,r),A(t,t.RGBA,t.RGBA,r));return{gl:t,ext:{formatRGBA:a,formatRG:u,formatR:c,halfFloatTexType:r,supportLinearFiltering:n}}}(d);V.supportLinearFiltering||(config.DYE_RESOLUTION=256,config.SHADING=!1);class W{constructor(e,r){this.uniforms={},this.program=_(e,r),this.uniforms=y(this.program)}bind(){H.useProgram(this.program)}}var t=w(H.VERTEX_SHADER,`
                    precision highp float;
                    attribute vec2 aPosition;
                    varying vec2 vUv;
                    varying vec2 vL;
                    varying vec2 vR;
                    varying vec2 vT;
                    varying vec2 vB;
                    uniform vec2 texelSize;

                    void main () {
                        vUv = aPosition * 0.5 + 0.5;
                        vL = vUv - vec2(texelSize.x, 0.0);
                        vR = vUv + vec2(texelSize.x, 0.0);
                        vT = vUv + vec2(0.0, texelSize.y);
                        vB = vUv - vec2(0.0, texelSize.y);
                        gl_Position = vec4(aPosition, 0.0, 1.0);
                    }
                `),h=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    uniform sampler2D uTexture;

                    void main () {
                        gl_FragColor = texture2D(uTexture, vUv);
                    }
                `),g=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    uniform sampler2D uTexture;
                    uniform float value;

                    void main () {
                        gl_FragColor = value * texture2D(uTexture, vUv);
                    }
                `),x=w(H.FRAGMENT_SHADER,`
                    precision highp float;
                    precision highp sampler2D;
                    varying vec2 vUv;
                    uniform sampler2D uTarget;
                    uniform float aspectRatio;
                    uniform vec3 color;
                    uniform vec2 point;
                    uniform float radius;

                    void main () {
                        vec2 p = vUv - point.xy;
                        p.x *= aspectRatio;
                        vec3 splat = exp(-dot(p, p) / radius) * color;
                        vec3 base = texture2D(uTarget, vUv).xyz;
                        gl_FragColor = vec4(base + splat, 1.0);
                    }
                `),T=w(H.FRAGMENT_SHADER,`
                    precision highp float;
                    precision highp sampler2D;
                    varying vec2 vUv;
                    uniform sampler2D uVelocity;
                    uniform sampler2D uSource;
                    uniform vec2 texelSize;
                    uniform vec2 dyeTexelSize;
                    uniform float dt;
                    uniform float dissipation;

                    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                        vec2 st = uv / tsize - 0.5;
                        vec2 iuv = floor(st);
                        vec2 fuv = fract(st);

                        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

                        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
                    }

                    void main () {
                        #ifdef MANUAL_FILTERING
                            vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                            vec4 result = bilerp(uSource, coord, dyeTexelSize);
                        #else
                            vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                            vec4 result = texture2D(uSource, coord);
                        #endif
                        float decay = 1.0 + dissipation * dt;
                        gl_FragColor = result / decay;
                    }
                `,V.supportLinearFiltering?null:["MANUAL_FILTERING"]),E=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    varying highp vec2 vL;
                    varying highp vec2 vR;
                    varying highp vec2 vT;
                    varying highp vec2 vB;
                    uniform sampler2D uVelocity;

                    void main () {
                        float L = texture2D(uVelocity, vL).x;
                        float R = texture2D(uVelocity, vR).x;
                        float T = texture2D(uVelocity, vT).y;
                        float B = texture2D(uVelocity, vB).y;

                        vec2 C = texture2D(uVelocity, vUv).xy;
                        if (vL.x < 0.0) { L = -C.x; }
                        if (vR.x > 1.0) { R = -C.x; }
                        if (vT.y > 1.0) { T = -C.y; }
                        if (vB.y < 0.0) { B = -C.y; }

                        float div = 0.5 * (R - L + T - B);
                        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
                    }
                `),R=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    varying highp vec2 vL;
                    varying highp vec2 vR;
                    varying highp vec2 vT;
                    varying highp vec2 vB;
                    uniform sampler2D uVelocity;

                    void main () {
                        float L = texture2D(uVelocity, vL).y;
                        float R = texture2D(uVelocity, vR).y;
                        float T = texture2D(uVelocity, vT).x;
                        float B = texture2D(uVelocity, vB).x;
                        float vorticity = R - L - T + B;
                        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
                    }
                `),p=w(H.FRAGMENT_SHADER,`
                    precision highp float;
                    precision highp sampler2D;
                    varying vec2 vUv;
                    varying vec2 vL;
                    varying vec2 vR;
                    varying vec2 vT;
                    varying vec2 vB;
                    uniform sampler2D uVelocity;
                    uniform sampler2D uCurl;
                    uniform float curl;
                    uniform float dt;

                    void main () {
                        float L = texture2D(uCurl, vL).x;
                        float R = texture2D(uCurl, vR).x;
                        float T = texture2D(uCurl, vT).x;
                        float B = texture2D(uCurl, vB).x;
                        float C = texture2D(uCurl, vUv).x;

                        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                        force /= length(force) + 0.0001;
                        force *= curl * C;
                        force.y *= -1.0;

                        vec2 velocity = texture2D(uVelocity, vUv).xy;
                        velocity += force * dt;
                        velocity = min(max(velocity, -1000.0), 1000.0);
                        gl_FragColor = vec4(velocity, 0.0, 1.0);
                    }
                `),S=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    varying highp vec2 vL;
                    varying highp vec2 vR;
                    varying highp vec2 vT;
                    varying highp vec2 vB;
                    uniform sampler2D uPressure;
                    uniform sampler2D uDivergence;

                    void main () {
                        float L = texture2D(uPressure, vL).x;
                        float R = texture2D(uPressure, vR).x;
                        float T = texture2D(uPressure, vT).x;
                        float B = texture2D(uPressure, vB).x;
                        float C = texture2D(uPressure, vUv).x;
                        float divergence = texture2D(uDivergence, vUv).x;
                        float pressure = (L + R + B + T - divergence) * 0.25;
                        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
                    }
                `),D=w(H.FRAGMENT_SHADER,`
                    precision mediump float;
                    precision mediump sampler2D;
                    varying highp vec2 vUv;
                    varying highp vec2 vL;
                    varying highp vec2 vR;
                    varying highp vec2 vT;
                    varying highp vec2 vB;
                    uniform sampler2D uPressure;
                    uniform sampler2D uVelocity;

                    void main () {
                        float L = texture2D(uPressure, vL).x;
                        float R = texture2D(uPressure, vR).x;
                        float T = texture2D(uPressure, vT).x;
                        float B = texture2D(uPressure, vB).x;
                        vec2 velocity = texture2D(uVelocity, vUv).xy;
                        velocity.xy -= vec2(R - L, T - B);
                        gl_FragColor = vec4(velocity, 0.0, 1.0);
                    }
                `);const k=(H.bindBuffer(H.ARRAY_BUFFER,H.createBuffer()),H.bufferData(H.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),H.STATIC_DRAW),H.bindBuffer(H.ELEMENT_ARRAY_BUFFER,H.createBuffer()),H.bufferData(H.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),H.STATIC_DRAW),H.vertexAttribPointer(0,2,H.FLOAT,!1,0,0),H.enableVertexAttribArray(0),(e,r=!1)=>{null==e?(H.viewport(0,0,H.drawingBufferWidth,H.drawingBufferHeight),H.bindFramebuffer(H.FRAMEBUFFER,null)):(H.viewport(0,0,e.width,e.height),H.bindFramebuffer(H.FRAMEBUFFER,e.fbo)),r&&(H.clearColor(0,0,0,1),H.clear(H.COLOR_BUFFER_BIT)),H.drawElements(H.TRIANGLES,6,H.UNSIGNED_SHORT,0)});let u,c,v,l,f;const K=new W(t,h),q=new W(t,g),j=new W(t,x),J=new W(t,T),Q=new W(t,E),Z=new W(t,R),$=new W(t,p),ee=new W(t,S),re=new W(t,D),te=new class{constructor(e,r){this.vertexShader=e,this.fragmentShaderSource=r,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(r){let t=0;for(let e=0;e<r.length;e++)t+=function(r){if(0===r.length)return 0;let t=0;for(let e=0;e<r.length;e++)t=(t<<5)-t+r.charCodeAt(e),t|=0;return t}(r[e]);let e=this.programs[t];var i;null==e&&(i=w(H.FRAGMENT_SHADER,this.fragmentShaderSource,r),e=_(this.vertexShader,i),this.programs[t]=e),e!==this.activeProgram&&(this.uniforms=y(e),this.activeProgram=e)}bind(){H.useProgram(this.activeProgram)}}(t,`
                precision highp float;
                precision highp sampler2D;
                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;
                uniform sampler2D uTexture;
                uniform sampler2D uDithering;
                uniform vec2 ditherScale;
                uniform vec2 texelSize;

                vec3 linearToGamma (vec3 color) {
                    color = max(color, vec3(0));
                    return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
                }

                void main () {
                    vec3 c = texture2D(uTexture, vUv).rgb;
                    #ifdef SHADING
                        vec3 lc = texture2D(uTexture, vL).rgb;
                        vec3 rc = texture2D(uTexture, vR).rgb;
                        vec3 tc = texture2D(uTexture, vT).rgb;
                        vec3 bc = texture2D(uTexture, vB).rgb;

                        float dx = length(rc) - length(lc);
                        float dy = length(tc) - length(bc);

                        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
                        vec3 l = vec3(0.0, 0.0, 1.0);

                        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
                        c *= diffuse;
                    #endif

                    float a = max(c.r, max(c.g, c.b));
                    gl_FragColor = vec4(c, a);
                }
            `);!function(){let e=[];config.SHADING&&e.push("SHADING"),te.setKeywords(e)}(),F();let m=Date.now(),s=0,i=!1;return window.addEventListener("mousedown",z),window.addEventListener("mousemove",O),window.addEventListener("touchstart",M),window.addEventListener("touchmove",G,!1),window.addEventListener("touchend",Y),function e(){var r,t,i;o&&(r=Date.now(),t=(r-m)/1e3,t=Math.min(t,.016666),m=r,i=t,r=X(d.clientWidth),t=X(d.clientHeight),d.width===r&&d.height===t||(d.width=r,d.height=t,0)||F(),t=i,s+=t*config.COLOR_UPDATE_SPEED,1<=s&&(s=function(e,r,t){return 0==(t-=r)?r:(e-r)%t+r}(s,0,1),a.forEach(e=>{e.color=I()})),a.forEach(e=>{var r,t;e.moved&&(e.moved=!1,t=(r=e).deltaX*config.SPLAT_FORCE,e=r.deltaY*config.SPLAT_FORCE,P(r.texcoordX,r.texcoordY,t,e,r.color))}),function(e){H.disable(H.BLEND),Z.bind(),H.uniform2f(Z.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniform1i(Z.uniforms.uVelocity,c.read.attach(0)),k(l),$.bind(),H.uniform2f($.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniform1i($.uniforms.uVelocity,c.read.attach(0)),H.uniform1i($.uniforms.uCurl,l.attach(1)),H.uniform1f($.uniforms.curl,config.CURL),H.uniform1f($.uniforms.dt,e),k(c.write),c.swap(),Q.bind(),H.uniform2f(Q.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniform1i(Q.uniforms.uVelocity,c.read.attach(0)),k(v),q.bind(),H.uniform1i(q.uniforms.uTexture,f.read.attach(0)),H.uniform1f(q.uniforms.value,config.PRESSURE),k(f.write),f.swap(),ee.bind(),H.uniform2f(ee.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniform1i(ee.uniforms.uDivergence,v.attach(0));for(let e=0;e<config.PRESSURE_ITERATIONS;e++)H.uniform1i(ee.uniforms.uPressure,f.read.attach(1)),k(f.write),f.swap();re.bind(),H.uniform2f(re.uniforms.texelSize,c.texelSizeX,c.texelSizeY),H.uniform1i(re.uniforms.uPressure,f.read.attach(0)),H.uniform1i(re.uniforms.uVelocity,c.read.attach(1)),k(c.write),c.swap(),J.bind(),H.uniform2f(J.uniforms.texelSize,c.texelSizeX,c.texelSizeY),V.supportLinearFiltering||H.uniform2f(J.uniforms.dyeTexelSize,c.texelSizeX,c.texelSizeY);var r=c.read.attach(0);H.uniform1i(J.uniforms.uVelocity,r),H.uniform1i(J.uniforms.uSource,r),H.uniform1f(J.uniforms.dt,e),H.uniform1f(J.uniforms.dissipation,config.VELOCITY_DISSIPATION),k(c.write),c.swap(),V.supportLinearFiltering||H.uniform2f(J.uniforms.dyeTexelSize,u.texelSizeX,u.texelSizeY),H.uniform1i(J.uniforms.uVelocity,c.read.attach(0)),H.uniform1i(J.uniforms.uSource,u.read.attach(1)),H.uniform1f(J.uniforms.dissipation,config.DENSITY_DISSIPATION),k(u.write),u.swap()}(i),i=null,H.blendFunc(H.ONE,H.ONE_MINUS_SRC_ALPHA),H.enable(H.BLEND),function(e){var r=null==e?H.drawingBufferWidth:e.width,t=null==e?H.drawingBufferHeight:e.height;te.bind(),config.SHADING&&H.uniform2f(te.uniforms.texelSize,1/r,1/t),H.uniform1i(te.uniforms.uTexture,u.read.attach(0)),k(e)}(i),n=requestAnimationFrame(e))}(),function(){o=!1,n&&(cancelAnimationFrame(n),n=null),window.removeEventListener("mousedown",z),window.removeEventListener("mousemove",O),window.removeEventListener("touchstart",M),window.removeEventListener("touchmove",G),window.removeEventListener("touchend",Y)};function A(e,r,t,i){if(!function(e,r,t,i){var o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);i=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);o=e.checkFramebufferStatus(e.FRAMEBUFFER);return o===e.FRAMEBUFFER_COMPLETE}(e,r,t,i))switch(r){case e.R16F:return A(e,e.RG16F,e.RG,i);case e.RG16F:return A(e,e.RGBA16F,e.RGBA,i);default:return null}return{internalFormat:r,format:t}}function _(e,r){var t=H.createProgram();return H.attachShader(t,e),H.attachShader(t,r),H.linkProgram(t),H.getProgramParameter(t,H.LINK_STATUS)||console.trace(H.getProgramInfoLog(t)),t}function y(r){let t=[];var i=H.getProgramParameter(r,H.ACTIVE_UNIFORMS);for(let e=0;e<i;e++){var o=H.getActiveUniform(r,e).name;t[o]=H.getUniformLocation(r,o)}return t}function w(e,r,t){r=function(e,r){if(!r)return e;let t="";return r.forEach(e=>{t+="#define "+e+"\n"}),t+e}(r,t);e=H.createShader(e);return H.shaderSource(e,r),H.compileShader(e),H.getShaderParameter(e,H.COMPILE_STATUS)||console.trace(H.getShaderInfoLog(e)),e}function F(){var e=N(config.SIM_RESOLUTION),r=N(config.DYE_RESOLUTION),t=V.halfFloatTexType,i=V.formatRGBA,o=V.formatRG,n=V.formatR,a=V.supportLinearFiltering?H.LINEAR:H.NEAREST;H.disable(H.BLEND),u=u?b(u,r.width,r.height,i.internalFormat,i.format,t,a):L(r.width,r.height,i.internalFormat,i.format,t,a),c=c?b(c,e.width,e.height,o.internalFormat,o.format,t,a):L(e.width,e.height,o.internalFormat,o.format,t,a),v=U(e.width,e.height,n.internalFormat,n.format,t,H.NEAREST),l=U(e.width,e.height,n.internalFormat,n.format,t,H.NEAREST),f=L(e.width,e.height,n.internalFormat,n.format,t,H.NEAREST)}function U(e,r,t,i,o,n){H.activeTexture(H.TEXTURE0);let a=H.createTexture();H.bindTexture(H.TEXTURE_2D,a),H.texParameteri(H.TEXTURE_2D,H.TEXTURE_MIN_FILTER,n),H.texParameteri(H.TEXTURE_2D,H.TEXTURE_MAG_FILTER,n),H.texParameteri(H.TEXTURE_2D,H.TEXTURE_WRAP_S,H.CLAMP_TO_EDGE),H.texParameteri(H.TEXTURE_2D,H.TEXTURE_WRAP_T,H.CLAMP_TO_EDGE),H.texImage2D(H.TEXTURE_2D,0,t,e,r,0,i,o,null);o=H.createFramebuffer();return H.bindFramebuffer(H.FRAMEBUFFER,o),H.framebufferTexture2D(H.FRAMEBUFFER,H.COLOR_ATTACHMENT0,H.TEXTURE_2D,a,0),H.viewport(0,0,e,r),H.clear(H.COLOR_BUFFER_BIT),{texture:a,fbo:o,width:e,height:r,texelSizeX:1/e,texelSizeY:1/r,attach(e){return H.activeTexture(H.TEXTURE0+e),H.bindTexture(H.TEXTURE_2D,a),e}}}function L(e,r,t,i,o,n){let a=U(e,r,t,i,o,n),u=U(e,r,t,i,o,n);return{width:e,height:r,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a},set read(e){a=e},get write(){return u},set write(e){u=e},swap(){var e=a;a=u,u=e}}}function b(e,r,t,i,o,n,a){return e.width===r&&e.height===t||(e.read=(u=e.read,c=U(r,t,i,o,n,c=a),K.bind(),H.uniform1i(K.uniforms.uTexture,u.attach(0)),k(c),c),e.write=U(r,t,i,o,n,a),e.width=r,e.height=t,e.texelSizeX=1/r,e.texelSizeY=1/t),e;var u,c}function P(e,r,t,i,o){j.bind(),H.uniform1i(j.uniforms.uTarget,c.read.attach(0)),H.uniform1f(j.uniforms.aspectRatio,d.width/d.height),H.uniform2f(j.uniforms.point,e,r),H.uniform3f(j.uniforms.color,t,i,0),H.uniform1f(j.uniforms.radius,function(e){var r=d.width/d.height;1<r&&(e*=r);return e}(config.SPLAT_RADIUS/100)),k(c.write),c.swap(),H.uniform1i(j.uniforms.uTarget,u.read.attach(0)),H.uniform3f(j.uniforms.color,o.r,o.g,o.b),k(u.write),u.swap()}function B(e,r,t,i){e.id=r,e.down=!0,e.moved=!1,e.texcoordX=t/d.width,e.texcoordY=1-i/d.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=I()}function C(e,r,t,i){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/d.width,e.texcoordY=1-t/d.height,e.deltaX=function(e){var r=d.width/d.height;r<1&&(e*=r);return e}(e.texcoordX-e.prevTexcoordX),e.deltaY=function(e){var r=d.width/d.height;1<r&&(e/=r);return e}(e.texcoordY-e.prevTexcoordY),e.moved=0<Math.abs(e.deltaX)||0<Math.abs(e.deltaY),e.color=i}function I(){let e=function(e,r,t){let i,o,n,a,u,c,v,l;switch(a=Math.floor(6*e),u=6*e-a,c=t*(1-r),v=t*(1-u*r),l=t*(1-(1-u)*r),a%6){case 0:i=t,o=l,n=c;break;case 1:i=v,o=t,n=c;break;case 2:i=c,o=t,n=l;break;case 3:i=c,o=v,n=t;break;case 4:i=l,o=c,n=t;break;case 5:i=t,o=c,n=v}return{r:i,g:o,b:n}}(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function N(e){let r=H.drawingBufferWidth/H.drawingBufferHeight;r<1&&(r=1/r);var t=Math.round(e),e=Math.round(e*r);return H.drawingBufferWidth>H.drawingBufferHeight?{width:e,height:t}:{width:t,height:e}}function X(e){var r=window.devicePixelRatio||1;return Math.floor(e*r)}function z(e){var r=a[0];B(r,-1,X(e.clientX),X(e.clientY)),function(e){const r=I();r.r*=10,r.g*=10,r.b*=10;var t=10*(Math.random()-.5),i=30*(Math.random()-.5);P(e.texcoordX,e.texcoordY,t,i,r)}(r)}function O(e){var r=a[0],t=X(e.clientX),e=X(e.clientY);i?C(r,t,e,r.color):(C(r,t,e,I()),i=!0)}function M(e){var r=e.targetTouches,t=a[0];for(let e=0;e<r.length;e++){var i=X(r[e].clientX),o=X(r[e].clientY);B(t,r[e].identifier,i,o)}}function G(e){var r=e.targetTouches,t=a[0];for(let e=0;e<r.length;e++)C(t,X(r[e].clientX),X(r[e].clientY),t.color)}function Y(e){var r=e.changedTouches,t=a[0];for(let e=0;e<r.length;e++)t.down=!1}}}initFluidCursor();