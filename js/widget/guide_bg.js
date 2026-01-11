"use strict";!function(){const n=document.getElementById("guide-bg");se();let v={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.25,SPLAT_FORCE:6e3,SHADING:!0,COLORFUL:!0,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:0,g:0,b:0},TRANSPARENT:!1,BLOOM:!0,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!0,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function o(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let a=[],r=[];a.push(new o);const{gl:l,ext:u}=function(e){var r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t=e.getContext("webgl2",r);var i=!!t;i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let o,n;n=i?(t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear")):(o=t.getExtension("OES_texture_half_float"),t.getExtension("OES_texture_half_float_linear"));t.clearColor(0,0,0,1);r=i?t.HALF_FLOAT:o.HALF_FLOAT_OES;let a,u,v;v=i?(a=c(t,t.RGBA16F,t.RGBA,r),u=c(t,t.RG16F,t.RG,r),c(t,t.R16F,t.RED,r)):(a=c(t,t.RGBA,t.RGBA,r),u=c(t,t.RGBA,t.RGBA,r),c(t,t.RGBA,t.RGBA,r));return{gl:t,ext:{formatRGBA:a,formatRG:u,formatR:v,halfFloatTexType:r,supportLinearFiltering:n}}}(n);function c(e,r,t,i){if(!function(e,r,t,i){var o=e.createTexture();e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);i=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o,0);o=e.checkFramebufferStatus(e.FRAMEBUFFER);return o==e.FRAMEBUFFER_COMPLETE}(e,r,t,i))switch(r){case e.R16F:return c(e,e.RG16F,e.RG,i);case e.RG16F:return c(e,e.RGBA16F,e.RGBA,i);default:return null}return{internalFormat:r,format:t}}/Mobi|Android/i.test(navigator.userAgent)&&(v.DYE_RESOLUTION=512),u.supportLinearFiltering||(v.DYE_RESOLUTION=512,v.SHADING=!1,v.BLOOM=!1,v.SUNRAYS=!1);class e{constructor(e,r){this.uniforms={},this.program=f(e,r),this.uniforms=m(this.program)}bind(){l.useProgram(this.program)}}function f(e,r){var t=l.createProgram();return l.attachShader(t,e),l.attachShader(t,r),l.linkProgram(t),l.getProgramParameter(t,l.LINK_STATUS)||console.trace(l.getProgramInfoLog(t)),t}function m(r){let t=[];var i=l.getProgramParameter(r,l.ACTIVE_UNIFORMS);for(let e=0;e<i;e++){var o=l.getActiveUniform(r,e).name;t[o]=l.getUniformLocation(r,o)}return t}function s(e,r,t){r=function(e,r){if(null==r)return e;let t="";return r.forEach(e=>{t+="#define "+e+"\n"}),t+e}(r,t);e=l.createShader(e);return l.shaderSource(e,r),l.compileShader(e),l.getShaderParameter(e,l.COMPILE_STATUS)||console.trace(l.getShaderInfoLog(e)),e}var t=s(l.VERTEX_SHADER,`
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
`),i=s(l.VERTEX_SHADER,`
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`),h=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
`),T=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),d=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),g=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    uniform vec4 color;
    void main () {
        gl_FragColor = color;
    }
`),E=s(l.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float aspectRatio;
    #define SCALE 25.0
    void main () {
        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));
        float v = mod(uv.x + uv.y, 2.0);
        v = v * 0.1 + 0.8;
        gl_FragColor = vec4(vec3(v), 1.0);
    }
`),x=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
`),R=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
`),p=s(l.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
`),S=s(l.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
    }
`),D=s(l.FRAGMENT_SHADER,`
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float weight;
    #define ITERATIONS 16
    void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;
        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;
        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;
        float color = texture2D(uTexture, vUv).a;
        for (int i = 0; i < ITERATIONS; i++)
        {
            coord -= dir;
            float col = texture2D(uTexture, coord).a;
            color += col * illuminationDecay * weight;
            illuminationDecay *= Decay;
        }
        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
    }
`),A=s(l.FRAGMENT_SHADER,`
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
`),_=s(l.FRAGMENT_SHADER,`
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
    }`,u.supportLinearFiltering?null:["MANUAL_FILTERING"]),U=s(l.FRAGMENT_SHADER,`
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
`),y=s(l.FRAGMENT_SHADER,`
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
`),L=s(l.FRAGMENT_SHADER,`
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
`),F=s(l.FRAGMENT_SHADER,`
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
`),O=s(l.FRAGMENT_SHADER,`
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
`);const w=(l.bindBuffer(l.ARRAY_BUFFER,l.createBuffer()),l.bufferData(l.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),l.STATIC_DRAW),l.bindBuffer(l.ELEMENT_ARRAY_BUFFER,l.createBuffer()),l.bufferData(l.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),l.STATIC_DRAW),l.vertexAttribPointer(0,2,l.FLOAT,!1,0,0),l.enableVertexAttribArray(0),(e,r=!1)=>{null==e?(l.viewport(0,0,l.drawingBufferWidth,l.drawingBufferHeight),l.bindFramebuffer(l.FRAMEBUFFER,null)):(l.viewport(0,0,e.width,e.height),l.bindFramebuffer(l.FRAMEBUFFER,e.fbo)),r&&(l.clearColor(0,0,0,1),l.clear(l.COLOR_BUFFER_BIT)),l.drawElements(l.TRIANGLES,6,l.UNSIGNED_SHORT,0)});let N,b,B,I,P,M,X=[],C,z,G=function(e){let r=l.createTexture();l.bindTexture(l.TEXTURE_2D,r),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.LINEAR),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.REPEAT),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.REPEAT),l.texImage2D(l.TEXTURE_2D,0,l.RGB,1,1,0,l.RGB,l.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let t={texture:r,width:1,height:1,attach(e){return l.activeTexture(l.TEXTURE0+e),l.bindTexture(l.TEXTURE_2D,r),e}},i=new Image;return i.onload=()=>{t.width=i.width,t.height=i.height,l.bindTexture(l.TEXTURE_2D,r),l.texImage2D(l.TEXTURE_2D,0,l.RGB,l.RGB,l.UNSIGNED_BYTE,i)},i.src=e,t}("/img/guide-bg.png");const Y=new e(i,h),H=new e(t,T),V=new e(t,d),W=new e(t,g),k=new e(t,E),K=new e(t,x),q=new e(t,R),j=new e(t,p),J=new e(t,S),Q=new e(t,D),Z=new e(t,A),$=new e(t,_),ee=new e(t,U),re=new e(t,y),te=new e(t,L),ie=new e(t,F),oe=new e(t,O),ne=new class{constructor(e,r){this.vertexShader=e,this.fragmentShaderSource=r,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(r){let t=0;for(let e=0;e<r.length;e++)t+=function(r){if(0==r.length)return 0;let t=0;for(let e=0;e<r.length;e++)t=(t<<5)-t+r.charCodeAt(e),t|=0;return t}(r[e]);let e=this.programs[t];var i;null==e&&(i=s(l.FRAGMENT_SHADER,this.fragmentShaderSource,r),e=f(this.vertexShader,i),this.programs[t]=e),e!=this.activeProgram&&(this.uniforms=m(e),this.activeProgram=e)}bind(){l.useProgram(this.activeProgram)}}(t,`
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
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
    #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
    #endif
    #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
    #ifdef BLOOM
        bloom *= sunrays;
    #endif
    #endif
    #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
    #endif
        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
`);function ae(){var e=Ae(v.SIM_RESOLUTION),r=Ae(v.DYE_RESOLUTION),t=u.halfFloatTexType,i=u.formatRGBA,o=u.formatRG,n=u.formatR,a=u.supportLinearFiltering?l.LINEAR:l.NEAREST;l.disable(l.BLEND),N=null==N?ve(r.width,r.height,i.internalFormat,i.format,t,a):le(N,r.width,r.height,i.internalFormat,i.format,t,a),b=null==b?ve(e.width,e.height,o.internalFormat,o.format,t,a):le(b,e.width,e.height,o.internalFormat,o.format,t,a),B=ue(e.width,e.height,n.internalFormat,n.format,t,l.NEAREST),I=ue(e.width,e.height,n.internalFormat,n.format,t,l.NEAREST),P=ve(e.width,e.height,n.internalFormat,n.format,t,l.NEAREST),function(){var r=Ae(v.BLOOM_RESOLUTION);var t=u.halfFloatTexType,i=u.formatRGBA,o=u.supportLinearFiltering?l.LINEAR:l.NEAREST;M=ue(r.width,r.height,i.internalFormat,i.format,t,o);for(let e=X.length=0;e<v.BLOOM_ITERATIONS;e++){var n=r.width>>e+1,a=r.height>>e+1;if(n<2||a<2)break;a=ue(n,a,i.internalFormat,i.format,t,o);X.push(a)}}(),a=Ae(v.SUNRAYS_RESOLUTION),e=u.halfFloatTexType,n=u.formatR,t=u.supportLinearFiltering?l.LINEAR:l.NEAREST,C=ue(a.width,a.height,n.internalFormat,n.format,e,t),z=ue(a.width,a.height,n.internalFormat,n.format,e,t)}function ue(e,r,t,i,o,n){l.activeTexture(l.TEXTURE0);let a=l.createTexture();l.bindTexture(l.TEXTURE_2D,a),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,n),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,n),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),l.texImage2D(l.TEXTURE_2D,0,t,e,r,0,i,o,null);o=l.createFramebuffer();return l.bindFramebuffer(l.FRAMEBUFFER,o),l.framebufferTexture2D(l.FRAMEBUFFER,l.COLOR_ATTACHMENT0,l.TEXTURE_2D,a,0),l.viewport(0,0,e,r),l.clear(l.COLOR_BUFFER_BIT),{texture:a,fbo:o,width:e,height:r,texelSizeX:1/e,texelSizeY:1/r,attach(e){return l.activeTexture(l.TEXTURE0+e),l.bindTexture(l.TEXTURE_2D,a),e}}}function ve(e,r,t,i,o,n){let a=ue(e,r,t,i,o,n),u=ue(e,r,t,i,o,n);return{width:e,height:r,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a},set read(e){a=e},get write(){return u},set write(e){u=e},swap(){var e=a;a=u,u=e}}}function le(e,r,t,i,o,n,a){return e.width==r&&e.height==t||(e.read=(u=e.read,v=ue(r,t,i,o,n,v=a),H.bind(),l.uniform1i(H.uniforms.uTexture,u.attach(0)),w(v),v),e.write=ue(r,t,i,o,n,a),e.width=r,e.height=t,e.texelSizeX=1/r,e.texelSizeY=1/t),e;var u,v}!function(){let e=[];v.SHADING&&e.push("SHADING"),v.BLOOM&&e.push("BLOOM"),v.SUNRAYS&&e.push("SUNRAYS"),ne.setKeywords(e)}(),ae(),Ee(parseInt(20*Math.random())+5);let ce=Date.now(),fe=0;function me(){var e=Date.now(),r=(e-ce)/1e3,r=Math.min(r,.016666);return ce=e,r}function se(){var e=_e(n.clientWidth),r=_e(n.clientHeight);return(n.width!=e||n.height!=r)&&(n.width=e,n.height=r,!0)}function he(e){v.COLORFUL&&(fe+=e*v.COLOR_UPDATE_SPEED,1<=fe&&(fe=function(e,r,t){t-=r;return 0==t?r:(e-r)%t+r}(fe,0,1),a.forEach(e=>{e.color=De()})))}function Te(){0<r.length&&Ee(r.pop()),a.forEach(e=>{var r,t;e.moved&&(e.moved=!1,t=(r=e).deltaX*v.SPLAT_FORCE,e=r.deltaY*v.SPLAT_FORCE,xe(r.texcoordX,r.texcoordY,t,e,r.color))})}function de(e){l.disable(l.BLEND),re.bind(),l.uniform2f(re.uniforms.texelSize,b.texelSizeX,b.texelSizeY),l.uniform1i(re.uniforms.uVelocity,b.read.attach(0)),w(I),te.bind(),l.uniform2f(te.uniforms.texelSize,b.texelSizeX,b.texelSizeY),l.uniform1i(te.uniforms.uVelocity,b.read.attach(0)),l.uniform1i(te.uniforms.uCurl,I.attach(1)),l.uniform1f(te.uniforms.curl,v.CURL),l.uniform1f(te.uniforms.dt,e),w(b.write),b.swap(),ee.bind(),l.uniform2f(ee.uniforms.texelSize,b.texelSizeX,b.texelSizeY),l.uniform1i(ee.uniforms.uVelocity,b.read.attach(0)),w(B),V.bind(),l.uniform1i(V.uniforms.uTexture,P.read.attach(0)),l.uniform1f(V.uniforms.value,v.PRESSURE),w(P.write),P.swap(),ie.bind(),l.uniform2f(ie.uniforms.texelSize,b.texelSizeX,b.texelSizeY),l.uniform1i(ie.uniforms.uDivergence,B.attach(0));for(let e=0;e<v.PRESSURE_ITERATIONS;e++)l.uniform1i(ie.uniforms.uPressure,P.read.attach(1)),w(P.write),P.swap();oe.bind(),l.uniform2f(oe.uniforms.texelSize,b.texelSizeX,b.texelSizeY),l.uniform1i(oe.uniforms.uPressure,P.read.attach(0)),l.uniform1i(oe.uniforms.uVelocity,b.read.attach(1)),w(b.write),b.swap(),$.bind(),l.uniform2f($.uniforms.texelSize,b.texelSizeX,b.texelSizeY),u.supportLinearFiltering||l.uniform2f($.uniforms.dyeTexelSize,b.texelSizeX,b.texelSizeY);var r=b.read.attach(0);l.uniform1i($.uniforms.uVelocity,r),l.uniform1i($.uniforms.uSource,r),l.uniform1f($.uniforms.dt,e),l.uniform1f($.uniforms.dissipation,v.VELOCITY_DISSIPATION),w(b.write),b.swap(),u.supportLinearFiltering||l.uniform2f($.uniforms.dyeTexelSize,N.texelSizeX,N.texelSizeY),l.uniform1i($.uniforms.uVelocity,b.read.attach(0)),l.uniform1i($.uniforms.uSource,N.read.attach(1)),l.uniform1f($.uniforms.dissipation,v.DENSITY_DISSIPATION),w(N.write),N.swap()}function ge(e){var r,t,i,o;v.BLOOM&&function(e,t){if(!(X.length<2)){let r=t;l.disable(l.BLEND),K.bind();var i=v.BLOOM_THRESHOLD*v.BLOOM_SOFT_KNEE+1e-4,o=v.BLOOM_THRESHOLD-i,n=2*i,i=.25/i;l.uniform3f(K.uniforms.curve,o,n,i),l.uniform1f(K.uniforms.threshold,v.BLOOM_THRESHOLD),l.uniform1i(K.uniforms.uTexture,e.attach(0)),w(r),q.bind();for(let e=0;e<X.length;e++){var a=X[e];l.uniform2f(q.uniforms.texelSize,r.texelSizeX,r.texelSizeY),l.uniform1i(q.uniforms.uTexture,r.attach(0)),w(a),r=a}l.blendFunc(l.ONE,l.ONE),l.enable(l.BLEND);for(let e=X.length-2;0<=e;e--){var u=X[e];l.uniform2f(q.uniforms.texelSize,r.texelSizeX,r.texelSizeY),l.uniform1i(q.uniforms.uTexture,r.attach(0)),l.viewport(0,0,u.width,u.height),w(u),r=u}l.disable(l.BLEND),j.bind(),l.uniform2f(j.uniforms.texelSize,r.texelSizeX,r.texelSizeY),l.uniform1i(j.uniforms.uTexture,r.attach(0)),l.uniform1f(j.uniforms.intensity,v.BLOOM_INTENSITY),w(t)}}(N.read,M),v.SUNRAYS&&(r=N.read,t=N.write,i=C,l.disable(l.BLEND),J.bind(),l.uniform1i(J.uniforms.uTexture,r.attach(0)),w(t),Q.bind(),l.uniform1f(Q.uniforms.weight,v.SUNRAYS_WEIGHT),l.uniform1i(Q.uniforms.uTexture,t.attach(0)),w(i),function(r,t,i){Y.bind();for(let e=0;e<i;e++)l.uniform2f(Y.uniforms.texelSize,r.texelSizeX,0),l.uniform1i(Y.uniforms.uTexture,r.attach(0)),w(t),l.uniform2f(Y.uniforms.texelSize,0,r.texelSizeY),l.uniform1i(Y.uniforms.uTexture,t.attach(0)),w(r)}(C,z,1)),null!=e&&v.TRANSPARENT?l.disable(l.BLEND):(l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),l.enable(l.BLEND)),v.TRANSPARENT||(o=e,i=function(e){e={r:e.r/255,g:e.g/255,b:e.b/255};return e}(v.BACK_COLOR),W.bind(),l.uniform4f(W.uniforms.color,i.r,i.g,i.b,1),w(o)),null==e&&v.TRANSPARENT&&(o=e,k.bind(),l.uniform1f(k.uniforms.aspectRatio,n.width/n.height),w(o)),function(e){var r=null==e?l.drawingBufferWidth:e.width,t=null==e?l.drawingBufferHeight:e.height;ne.bind(),v.SHADING&&l.uniform2f(ne.uniforms.texelSize,1/r,1/t);l.uniform1i(ne.uniforms.uTexture,N.read.attach(0)),v.BLOOM&&(l.uniform1i(ne.uniforms.uBloom,M.attach(1)),l.uniform1i(ne.uniforms.uDithering,G.attach(2)),t=function(e,r,t){return{x:r/e.width,y:t/e.height}}(G,r,t),l.uniform2f(ne.uniforms.ditherScale,t.x,t.y));v.SUNRAYS&&l.uniform1i(ne.uniforms.uSunrays,C.attach(3));w(e)}(e)}function Ee(r){for(let e=0;e<r;e++){const t=De();t.r*=10,t.g*=10,t.b*=10,xe(Math.random(),Math.random(),1e3*(Math.random()-.5),1e3*(Math.random()-.5),t)}}function xe(e,r,t,i,o){Z.bind(),l.uniform1i(Z.uniforms.uTarget,b.read.attach(0)),l.uniform1f(Z.uniforms.aspectRatio,n.width/n.height),l.uniform2f(Z.uniforms.point,e,r),l.uniform3f(Z.uniforms.color,t,i,0),l.uniform1f(Z.uniforms.radius,function(e){var r=n.width/n.height;1<r&&(e*=r);return e}(v.SPLAT_RADIUS/100)),w(b.write),b.swap(),l.uniform1i(Z.uniforms.uTarget,N.read.attach(0)),l.uniform3f(Z.uniforms.color,o.r,o.g,o.b),w(N.write),N.swap()}function Re(e,r,t,i){e.id=r,e.down=!0,e.moved=!1,e.texcoordX=t/n.width,e.texcoordY=1-i/n.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=De()}function pe(e,r,t){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/n.width,e.texcoordY=1-t/n.height,e.deltaX=function(e){var r=n.width/n.height;r<1&&(e*=r);return e}(e.texcoordX-e.prevTexcoordX),e.deltaY=function(e){var r=n.width/n.height;1<r&&(e/=r);return e}(e.texcoordY-e.prevTexcoordY),e.moved=0<Math.abs(e.deltaX)||0<Math.abs(e.deltaY)}function Se(e){e.down=!1}function De(){let e=function(e,r,t){let i,o,n,a,u,v,l,c;switch(a=Math.floor(6*e),u=6*e-a,v=t*(1-r),l=t*(1-u*r),c=t*(1-(1-u)*r),a%6){case 0:i=t,o=c,n=v;break;case 1:i=l,o=t,n=v;break;case 2:i=v,o=t,n=c;break;case 3:i=v,o=l,n=t;break;case 4:i=c,o=v,n=t;break;case 5:i=t,o=v,n=l}return{r:i,g:o,b:n}}(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function Ae(e){let r=l.drawingBufferWidth/l.drawingBufferHeight;r<1&&(r=1/r);var t=Math.round(e),e=Math.round(e*r);return l.drawingBufferWidth>l.drawingBufferHeight?{width:e,height:t}:{width:t,height:e}}function _e(e){var r=window.devicePixelRatio||1;return Math.floor(e*r)}!function e(){const r=me();se()&&ae();he(r);Te();v.PAUSED||de(r);ge(null);requestAnimationFrame(e)}(),document.addEventListener("mousedown",e=>{var r=_e(e.clientX),e=_e(e.clientY);let t=a.find(e=>-1==e.id);null==t&&(t=new o),Re(t,-1,r,e)}),document.addEventListener("mousemove",e=>{var r=a[0];r.down&&pe(r,_e(e.clientX),_e(e.clientY))}),window.addEventListener("mouseup",()=>{Se(a[0])}),n.addEventListener("touchstart",e=>{e.preventDefault();for(var r=e.targetTouches;r.length>=a.length;)a.push(new o);for(let e=0;e<r.length;e++){var t=_e(r[e].pageX),i=_e(r[e].pageY);Re(a[e+1],r[e].identifier,t,i)}}),n.addEventListener("touchmove",e=>{e.preventDefault();var r=e.targetTouches;for(let e=0;e<r.length;e++){var t=a[e+1];t.down&&pe(t,_e(r[e].pageX),_e(r[e].pageY))}},!1),window.addEventListener("touchend",e=>{const t=e.changedTouches;for(let r=0;r<t.length;r++){var i=a.find(e=>e.id==t[r].identifier);null!=i&&Se(i)}}),window.addEventListener("keydown",e=>{"KeyP"===e.code&&(v.PAUSED=!v.PAUSED)," "===e.key&&r.push(parseInt(20*Math.random())+5)})}();