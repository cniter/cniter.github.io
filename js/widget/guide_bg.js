"use strict";const canvas=document.getElementById("guide-bg");resizeCanvas();let guide_bg_config={SIM_RESOLUTION:128,DYE_RESOLUTION:1024,CAPTURE_RESOLUTION:512,DENSITY_DISSIPATION:1,VELOCITY_DISSIPATION:.2,PRESSURE:.8,PRESSURE_ITERATIONS:20,CURL:30,SPLAT_RADIUS:.25,SPLAT_FORCE:6e3,SHADING:!0,COLORFUL:!0,COLOR_UPDATE_SPEED:10,PAUSED:!1,BACK_COLOR:{r:0,g:0,b:0},TRANSPARENT:!1,BLOOM:!0,BLOOM_ITERATIONS:8,BLOOM_RESOLUTION:256,BLOOM_INTENSITY:.8,BLOOM_THRESHOLD:.6,BLOOM_SOFT_KNEE:.7,SUNRAYS:!0,SUNRAYS_RESOLUTION:196,SUNRAYS_WEIGHT:1};function pointerPrototype(){this.id=-1,this.texcoordX=0,this.texcoordY=0,this.prevTexcoordX=0,this.prevTexcoordY=0,this.deltaX=0,this.deltaY=0,this.down=!1,this.moved=!1,this.color=[30,0,300]}let pointers=[],splatStack=[];pointers.push(new pointerPrototype);const{gl,ext}=getWebGLContext(canvas);function getWebGLContext(e){var r={alpha:!0,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1};let t=e.getContext("webgl2",r);var i=!!t;i||(t=e.getContext("webgl",r)||e.getContext("experimental-webgl",r));let a,o;o=i?(t.getExtension("EXT_color_buffer_float"),t.getExtension("OES_texture_float_linear")):(a=t.getExtension("OES_texture_half_float"),t.getExtension("OES_texture_half_float_linear")),t.clearColor(0,0,0,1);r=i?t.HALF_FLOAT:a.HALF_FLOAT_OES;let l,n,u;return u=i?(l=getSupportedFormat(t,t.RGBA16F,t.RGBA,r),n=getSupportedFormat(t,t.RG16F,t.RG,r),getSupportedFormat(t,t.R16F,t.RED,r)):(l=getSupportedFormat(t,t.RGBA,t.RGBA,r),n=getSupportedFormat(t,t.RGBA,t.RGBA,r),getSupportedFormat(t,t.RGBA,t.RGBA,r)),{gl:t,ext:{formatRGBA:l,formatRG:n,formatR:u,halfFloatTexType:r,supportLinearFiltering:o}}}function getSupportedFormat(e,r,t,i){if(!supportRenderTextureFormat(e,r,t,i))switch(r){case e.R16F:return getSupportedFormat(e,e.RG16F,e.RG,i);case e.RG16F:return getSupportedFormat(e,e.RGBA16F,e.RGBA,i);default:return null}return{internalFormat:r,format:t}}function supportRenderTextureFormat(e,r,t,i){var a=e.createTexture();e.bindTexture(e.TEXTURE_2D,a),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,t,i,null);i=e.createFramebuffer();return e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a,0),e.checkFramebufferStatus(e.FRAMEBUFFER)==e.FRAMEBUFFER_COMPLETE}function isMobile(){return/Mobi|Android/i.test(navigator.userAgent)}function framebufferToTexture(e){gl.bindFramebuffer(gl.FRAMEBUFFER,e.fbo);var r=e.width*e.height*4,r=new Float32Array(r);return gl.readPixels(0,0,e.width,e.height,gl.RGBA,gl.FLOAT,r),r}function normalizeTexture(t,i,e){let a=new Uint8Array(t.length),o=0;for(let r=e-1;0<=r;r--)for(let e=0;e<i;e++){var l=r*i*4+4*e;a[l]=255*clamp01(t[o+0]),a[1+l]=255*clamp01(t[o+1]),a[2+l]=255*clamp01(t[o+2]),a[3+l]=255*clamp01(t[o+3]),o+=4}return a}function clamp01(e){return Math.min(Math.max(e,0),1)}isMobile()&&(guide_bg_config.DYE_RESOLUTION=512),ext.supportLinearFiltering||(guide_bg_config.DYE_RESOLUTION=512,guide_bg_config.SHADING=!1,guide_bg_config.BLOOM=!1,guide_bg_config.SUNRAYS=!1);class Material{constructor(e,r){this.vertexShader=e,this.fragmentShaderSource=r,this.programs=[],this.activeProgram=null,this.uniforms=[]}setKeywords(r){let t=0;for(let e=0;e<r.length;e++)t+=hashCode(r[e]);let e=this.programs[t];var i;null==e&&(i=compileShader(gl.FRAGMENT_SHADER,this.fragmentShaderSource,r),e=createProgram(this.vertexShader,i),this.programs[t]=e),e!=this.activeProgram&&(this.uniforms=getUniforms(e),this.activeProgram=e)}bind(){gl.useProgram(this.activeProgram)}}class Program{constructor(e,r){this.uniforms={},this.program=createProgram(e,r),this.uniforms=getUniforms(this.program)}bind(){gl.useProgram(this.program)}}function createProgram(e,r){var t=gl.createProgram();return gl.attachShader(t,e),gl.attachShader(t,r),gl.linkProgram(t),gl.getProgramParameter(t,gl.LINK_STATUS)||console.trace(gl.getProgramInfoLog(t)),t}function getUniforms(r){let t=[];var i=gl.getProgramParameter(r,gl.ACTIVE_UNIFORMS);for(let e=0;e<i;e++){var a=gl.getActiveUniform(r,e).name;t[a]=gl.getUniformLocation(r,a)}return t}function compileShader(e,r,t){r=addKeywords(r,t);e=gl.createShader(e);return gl.shaderSource(e,r),gl.compileShader(e),gl.getShaderParameter(e,gl.COMPILE_STATUS)||console.trace(gl.getShaderInfoLog(e)),e}function addKeywords(e,r){if(null==r)return e;let t="";return r.forEach(e=>{t+="#define "+e+"\n"}),t+e}const baseVertexShader=compileShader(gl.VERTEX_SHADER,`
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
`),blurVertexShader=compileShader(gl.VERTEX_SHADER,`
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
`),blurShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),copyShader=compileShader(gl.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
`),clearShader=compileShader(gl.FRAGMENT_SHADER,`
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
`),colorShader=compileShader(gl.FRAGMENT_SHADER,`
    precision mediump float;
    uniform vec4 color;
    void main () {
        gl_FragColor = color;
    }
`),checkerboardShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),displayShaderSource=`
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
`,bloomPrefilterShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),bloomBlurShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),bloomFinalShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),sunraysMaskShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),sunraysShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),splatShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),advectionShader=compileShader(gl.FRAGMENT_SHADER,`
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
    }`,ext.supportLinearFiltering?null:["MANUAL_FILTERING"]),divergenceShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),curlShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),vorticityShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),pressureShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),gradientSubtractShader=compileShader(gl.FRAGMENT_SHADER,`
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
`),blit=(gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer()),gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),gl.STATIC_DRAW),gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,gl.createBuffer()),gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),gl.STATIC_DRAW),gl.vertexAttribPointer(0,2,gl.FLOAT,!1,0,0),gl.enableVertexAttribArray(0),(e,r=!1)=>{null==e?(gl.viewport(0,0,gl.drawingBufferWidth,gl.drawingBufferHeight),gl.bindFramebuffer(gl.FRAMEBUFFER,null)):(gl.viewport(0,0,e.width,e.height),gl.bindFramebuffer(gl.FRAMEBUFFER,e.fbo)),r&&(gl.clearColor(0,0,0,1),gl.clear(gl.COLOR_BUFFER_BIT)),gl.drawElements(gl.TRIANGLES,6,gl.UNSIGNED_SHORT,0)});function CHECK_FRAMEBUFFER_STATUS(){var e=gl.checkFramebufferStatus(gl.FRAMEBUFFER);e!=gl.FRAMEBUFFER_COMPLETE&&console.trace("Framebuffer error: "+e)}let dye,velocity,divergence,curl,pressure,bloom,bloomFramebuffers=[],sunrays,sunraysTemp,ditheringTexture=createTextureAsync("/img/guide-bg.png");const blurProgram=new Program(blurVertexShader,blurShader),copyProgram=new Program(baseVertexShader,copyShader),clearProgram=new Program(baseVertexShader,clearShader),colorProgram=new Program(baseVertexShader,colorShader),checkerboardProgram=new Program(baseVertexShader,checkerboardShader),bloomPrefilterProgram=new Program(baseVertexShader,bloomPrefilterShader),bloomBlurProgram=new Program(baseVertexShader,bloomBlurShader),bloomFinalProgram=new Program(baseVertexShader,bloomFinalShader),sunraysMaskProgram=new Program(baseVertexShader,sunraysMaskShader),sunraysProgram=new Program(baseVertexShader,sunraysShader),splatProgram=new Program(baseVertexShader,splatShader),advectionProgram=new Program(baseVertexShader,advectionShader),divergenceProgram=new Program(baseVertexShader,divergenceShader),curlProgram=new Program(baseVertexShader,curlShader),vorticityProgram=new Program(baseVertexShader,vorticityShader),pressureProgram=new Program(baseVertexShader,pressureShader),gradienSubtractProgram=new Program(baseVertexShader,gradientSubtractShader),displayMaterial=new Material(baseVertexShader,displayShaderSource);function initFramebuffers(){var e=getResolution(guide_bg_config.SIM_RESOLUTION),r=getResolution(guide_bg_config.DYE_RESOLUTION),t=ext.halfFloatTexType,i=ext.formatRGBA,a=ext.formatRG,o=ext.formatR,l=ext.supportLinearFiltering?gl.LINEAR:gl.NEAREST;gl.disable(gl.BLEND),dye=null==dye?createDoubleFBO(r.width,r.height,i.internalFormat,i.format,t,l):resizeDoubleFBO(dye,r.width,r.height,i.internalFormat,i.format,t,l),velocity=null==velocity?createDoubleFBO(e.width,e.height,a.internalFormat,a.format,t,l):resizeDoubleFBO(velocity,e.width,e.height,a.internalFormat,a.format,t,l),divergence=createFBO(e.width,e.height,o.internalFormat,o.format,t,gl.NEAREST),curl=createFBO(e.width,e.height,o.internalFormat,o.format,t,gl.NEAREST),pressure=createDoubleFBO(e.width,e.height,o.internalFormat,o.format,t,gl.NEAREST),initBloomFramebuffers(),initSunraysFramebuffers()}function initBloomFramebuffers(){var r=getResolution(guide_bg_config.BLOOM_RESOLUTION),t=ext.halfFloatTexType,i=ext.formatRGBA,a=ext.supportLinearFiltering?gl.LINEAR:gl.NEAREST;bloom=createFBO(r.width,r.height,i.internalFormat,i.format,t,a);for(let e=bloomFramebuffers.length=0;e<guide_bg_config.BLOOM_ITERATIONS;e++){var o=r.width>>e+1,l=r.height>>e+1;if(o<2||l<2)break;l=createFBO(o,l,i.internalFormat,i.format,t,a);bloomFramebuffers.push(l)}}function initSunraysFramebuffers(){var e=getResolution(guide_bg_config.SUNRAYS_RESOLUTION),r=ext.halfFloatTexType,t=ext.formatR,i=ext.supportLinearFiltering?gl.LINEAR:gl.NEAREST;sunrays=createFBO(e.width,e.height,t.internalFormat,t.format,r,i),sunraysTemp=createFBO(e.width,e.height,t.internalFormat,t.format,r,i)}function createFBO(e,r,t,i,a,o){gl.activeTexture(gl.TEXTURE0);let l=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,l),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,o),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,o),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE),gl.texImage2D(gl.TEXTURE_2D,0,t,e,r,0,i,a,null);a=gl.createFramebuffer();return gl.bindFramebuffer(gl.FRAMEBUFFER,a),gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,l,0),gl.viewport(0,0,e,r),gl.clear(gl.COLOR_BUFFER_BIT),{texture:l,fbo:a,width:e,height:r,texelSizeX:1/e,texelSizeY:1/r,attach(e){return gl.activeTexture(gl.TEXTURE0+e),gl.bindTexture(gl.TEXTURE_2D,l),e}}}function createDoubleFBO(e,r,t,i,a,o){let l=createFBO(e,r,t,i,a,o),n=createFBO(e,r,t,i,a,o);return{width:e,height:r,texelSizeX:l.texelSizeX,texelSizeY:l.texelSizeY,get read(){return l},set read(e){l=e},get write(){return n},set write(e){n=e},swap(){var e=l;l=n,n=e}}}function resizeFBO(e,r,t,i,a,o,l){l=createFBO(r,t,i,a,o,l);return copyProgram.bind(),gl.uniform1i(copyProgram.uniforms.uTexture,e.attach(0)),blit(l),l}function resizeDoubleFBO(e,r,t,i,a,o,l){return e.width==r&&e.height==t||(e.read=resizeFBO(e.read,r,t,i,a,o,l),e.write=createFBO(r,t,i,a,o,l),e.width=r,e.height=t,e.texelSizeX=1/r,e.texelSizeY=1/t),e}function createTextureAsync(e){let r=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,r),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT),gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.REPEAT),gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,1,1,0,gl.RGB,gl.UNSIGNED_BYTE,new Uint8Array([255,255,255]));let t={texture:r,width:1,height:1,attach(e){return gl.activeTexture(gl.TEXTURE0+e),gl.bindTexture(gl.TEXTURE_2D,r),e}},i=new Image;return i.onload=()=>{t.width=i.width,t.height=i.height,gl.bindTexture(gl.TEXTURE_2D,r),gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,i)},i.src=e,t}function updateKeywords(){let e=[];guide_bg_config.SHADING&&e.push("SHADING"),guide_bg_config.BLOOM&&e.push("BLOOM"),guide_bg_config.SUNRAYS&&e.push("SUNRAYS"),displayMaterial.setKeywords(e)}updateKeywords(),initFramebuffers(),multipleSplats(parseInt(20*Math.random())+5);let lastUpdateTime=Date.now(),colorUpdateTimer=0;function update(){var e=calcDeltaTime();resizeCanvas()&&initFramebuffers(),updateColors(e),applyInputs(),guide_bg_config.PAUSED||step(e),render(null),requestAnimationFrame(update)}function calcDeltaTime(){var e=Date.now(),r=(e-lastUpdateTime)/1e3,r=Math.min(r,.016666);return lastUpdateTime=e,r}function resizeCanvas(){var e=scaleByPixelRatio(canvas.clientWidth),r=scaleByPixelRatio(canvas.clientHeight);return(canvas.width!=e||canvas.height!=r)&&(canvas.width=e,canvas.height=r,!0)}function updateColors(e){guide_bg_config.COLORFUL&&(colorUpdateTimer+=e*guide_bg_config.COLOR_UPDATE_SPEED,1<=colorUpdateTimer&&(colorUpdateTimer=wrap(colorUpdateTimer,0,1),pointers.forEach(e=>{e.color=generateColor()})))}function applyInputs(){0<splatStack.length&&multipleSplats(splatStack.pop()),pointers.forEach(e=>{e.moved&&(e.moved=!1,splatPointer(e))})}function step(e){gl.disable(gl.BLEND),curlProgram.bind(),gl.uniform2f(curlProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),gl.uniform1i(curlProgram.uniforms.uVelocity,velocity.read.attach(0)),blit(curl),vorticityProgram.bind(),gl.uniform2f(vorticityProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),gl.uniform1i(vorticityProgram.uniforms.uVelocity,velocity.read.attach(0)),gl.uniform1i(vorticityProgram.uniforms.uCurl,curl.attach(1)),gl.uniform1f(vorticityProgram.uniforms.curl,guide_bg_config.CURL),gl.uniform1f(vorticityProgram.uniforms.dt,e),blit(velocity.write),velocity.swap(),divergenceProgram.bind(),gl.uniform2f(divergenceProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),gl.uniform1i(divergenceProgram.uniforms.uVelocity,velocity.read.attach(0)),blit(divergence),clearProgram.bind(),gl.uniform1i(clearProgram.uniforms.uTexture,pressure.read.attach(0)),gl.uniform1f(clearProgram.uniforms.value,guide_bg_config.PRESSURE),blit(pressure.write),pressure.swap(),pressureProgram.bind(),gl.uniform2f(pressureProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),gl.uniform1i(pressureProgram.uniforms.uDivergence,divergence.attach(0));for(let e=0;e<guide_bg_config.PRESSURE_ITERATIONS;e++)gl.uniform1i(pressureProgram.uniforms.uPressure,pressure.read.attach(1)),blit(pressure.write),pressure.swap();gradienSubtractProgram.bind(),gl.uniform2f(gradienSubtractProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),gl.uniform1i(gradienSubtractProgram.uniforms.uPressure,pressure.read.attach(0)),gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity,velocity.read.attach(1)),blit(velocity.write),velocity.swap(),advectionProgram.bind(),gl.uniform2f(advectionProgram.uniforms.texelSize,velocity.texelSizeX,velocity.texelSizeY),ext.supportLinearFiltering||gl.uniform2f(advectionProgram.uniforms.dyeTexelSize,velocity.texelSizeX,velocity.texelSizeY);var r=velocity.read.attach(0);gl.uniform1i(advectionProgram.uniforms.uVelocity,r),gl.uniform1i(advectionProgram.uniforms.uSource,r),gl.uniform1f(advectionProgram.uniforms.dt,e),gl.uniform1f(advectionProgram.uniforms.dissipation,guide_bg_config.VELOCITY_DISSIPATION),blit(velocity.write),velocity.swap(),ext.supportLinearFiltering||gl.uniform2f(advectionProgram.uniforms.dyeTexelSize,dye.texelSizeX,dye.texelSizeY),gl.uniform1i(advectionProgram.uniforms.uVelocity,velocity.read.attach(0)),gl.uniform1i(advectionProgram.uniforms.uSource,dye.read.attach(1)),gl.uniform1f(advectionProgram.uniforms.dissipation,guide_bg_config.DENSITY_DISSIPATION),blit(dye.write),dye.swap()}function render(e){guide_bg_config.BLOOM&&applyBloom(dye.read,bloom),guide_bg_config.SUNRAYS&&(applySunrays(dye.read,dye.write,sunrays),blur(sunrays,sunraysTemp,1)),null!=e&&guide_bg_config.TRANSPARENT?gl.disable(gl.BLEND):(gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA),gl.enable(gl.BLEND)),guide_bg_config.TRANSPARENT||drawColor(e,normalizeColor(guide_bg_config.BACK_COLOR)),null==e&&guide_bg_config.TRANSPARENT&&drawCheckerboard(e),drawDisplay(e)}function drawColor(e,r){colorProgram.bind(),gl.uniform4f(colorProgram.uniforms.color,r.r,r.g,r.b,1),blit(e)}function drawCheckerboard(e){checkerboardProgram.bind(),gl.uniform1f(checkerboardProgram.uniforms.aspectRatio,canvas.width/canvas.height),blit(e)}function drawDisplay(e){var r=null==e?gl.drawingBufferWidth:e.width,t=null==e?gl.drawingBufferHeight:e.height;displayMaterial.bind(),guide_bg_config.SHADING&&gl.uniform2f(displayMaterial.uniforms.texelSize,1/r,1/t),gl.uniform1i(displayMaterial.uniforms.uTexture,dye.read.attach(0)),guide_bg_config.BLOOM&&(gl.uniform1i(displayMaterial.uniforms.uBloom,bloom.attach(1)),gl.uniform1i(displayMaterial.uniforms.uDithering,ditheringTexture.attach(2)),t=getTextureScale(ditheringTexture,r,t),gl.uniform2f(displayMaterial.uniforms.ditherScale,t.x,t.y)),guide_bg_config.SUNRAYS&&gl.uniform1i(displayMaterial.uniforms.uSunrays,sunrays.attach(3)),blit(e)}function applyBloom(e,t){if(!(bloomFramebuffers.length<2)){let r=t;gl.disable(gl.BLEND),bloomPrefilterProgram.bind();var i=guide_bg_config.BLOOM_THRESHOLD*guide_bg_config.BLOOM_SOFT_KNEE+1e-4,a=guide_bg_config.BLOOM_THRESHOLD-i,o=2*i,i=.25/i;gl.uniform3f(bloomPrefilterProgram.uniforms.curve,a,o,i),gl.uniform1f(bloomPrefilterProgram.uniforms.threshold,guide_bg_config.BLOOM_THRESHOLD),gl.uniform1i(bloomPrefilterProgram.uniforms.uTexture,e.attach(0)),blit(r),bloomBlurProgram.bind();for(let e=0;e<bloomFramebuffers.length;e++){var l=bloomFramebuffers[e];gl.uniform2f(bloomBlurProgram.uniforms.texelSize,r.texelSizeX,r.texelSizeY),gl.uniform1i(bloomBlurProgram.uniforms.uTexture,r.attach(0)),blit(l),r=l}gl.blendFunc(gl.ONE,gl.ONE),gl.enable(gl.BLEND);for(let e=bloomFramebuffers.length-2;0<=e;e--){var n=bloomFramebuffers[e];gl.uniform2f(bloomBlurProgram.uniforms.texelSize,r.texelSizeX,r.texelSizeY),gl.uniform1i(bloomBlurProgram.uniforms.uTexture,r.attach(0)),gl.viewport(0,0,n.width,n.height),blit(n),r=n}gl.disable(gl.BLEND),bloomFinalProgram.bind(),gl.uniform2f(bloomFinalProgram.uniforms.texelSize,r.texelSizeX,r.texelSizeY),gl.uniform1i(bloomFinalProgram.uniforms.uTexture,r.attach(0)),gl.uniform1f(bloomFinalProgram.uniforms.intensity,guide_bg_config.BLOOM_INTENSITY),blit(t)}}function applySunrays(e,r,t){gl.disable(gl.BLEND),sunraysMaskProgram.bind(),gl.uniform1i(sunraysMaskProgram.uniforms.uTexture,e.attach(0)),blit(r),sunraysProgram.bind(),gl.uniform1f(sunraysProgram.uniforms.weight,guide_bg_config.SUNRAYS_WEIGHT),gl.uniform1i(sunraysProgram.uniforms.uTexture,r.attach(0)),blit(t)}function blur(r,t,i){blurProgram.bind();for(let e=0;e<i;e++)gl.uniform2f(blurProgram.uniforms.texelSize,r.texelSizeX,0),gl.uniform1i(blurProgram.uniforms.uTexture,r.attach(0)),blit(t),gl.uniform2f(blurProgram.uniforms.texelSize,0,r.texelSizeY),gl.uniform1i(blurProgram.uniforms.uTexture,t.attach(0)),blit(r)}function splatPointer(e){var r=e.deltaX*guide_bg_config.SPLAT_FORCE,t=e.deltaY*guide_bg_config.SPLAT_FORCE;splat(e.texcoordX,e.texcoordY,r,t,e.color)}function multipleSplats(r){for(let e=0;e<r;e++){const t=generateColor();t.r*=10,t.g*=10,t.b*=10,splat(Math.random(),Math.random(),1e3*(Math.random()-.5),1e3*(Math.random()-.5),t)}}function splat(e,r,t,i,a){splatProgram.bind(),gl.uniform1i(splatProgram.uniforms.uTarget,velocity.read.attach(0)),gl.uniform1f(splatProgram.uniforms.aspectRatio,canvas.width/canvas.height),gl.uniform2f(splatProgram.uniforms.point,e,r),gl.uniform3f(splatProgram.uniforms.color,t,i,0),gl.uniform1f(splatProgram.uniforms.radius,correctRadius(guide_bg_config.SPLAT_RADIUS/100)),blit(velocity.write),velocity.swap(),gl.uniform1i(splatProgram.uniforms.uTarget,dye.read.attach(0)),gl.uniform3f(splatProgram.uniforms.color,a.r,a.g,a.b),blit(dye.write),dye.swap()}function correctRadius(e){var r=canvas.width/canvas.height;return 1<r&&(e*=r),e}function updatePointerDownData(e,r,t,i){e.id=r,e.down=!0,e.moved=!1,e.texcoordX=t/canvas.width,e.texcoordY=1-i/canvas.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=generateColor()}function updatePointerMoveData(e,r,t){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/canvas.width,e.texcoordY=1-t/canvas.height,e.deltaX=correctDeltaX(e.texcoordX-e.prevTexcoordX),e.deltaY=correctDeltaY(e.texcoordY-e.prevTexcoordY),e.moved=0<Math.abs(e.deltaX)||0<Math.abs(e.deltaY)}function updatePointerUpData(e){e.down=!1}function correctDeltaX(e){var r=canvas.width/canvas.height;return r<1&&(e*=r),e}function correctDeltaY(e){var r=canvas.width/canvas.height;return 1<r&&(e/=r),e}function generateColor(){let e=HSVtoRGB(Math.random(),1,1);return e.r*=.15,e.g*=.15,e.b*=.15,e}function HSVtoRGB(e,r,t){let i,a,o,l,n,u,g,c;switch(u=t*(1-r),g=t*(1-(n=6*e-(l=Math.floor(6*e)))*r),c=t*(1-(1-n)*r),l%6){case 0:i=t,a=c,o=u;break;case 1:i=g,a=t,o=u;break;case 2:i=u,a=t,o=c;break;case 3:i=u,a=g,o=t;break;case 4:i=c,a=u,o=t;break;case 5:i=t,a=u,o=g}return{r:i,g:a,b:o}}function normalizeColor(e){return{r:e.r/255,g:e.g/255,b:e.b/255}}function wrap(e,r,t){t-=r;return 0==t?r:(e-r)%t+r}function getResolution(e){let r=gl.drawingBufferWidth/gl.drawingBufferHeight;r<1&&(r=1/r);var t=Math.round(e),e=Math.round(e*r);return gl.drawingBufferWidth>gl.drawingBufferHeight?{width:e,height:t}:{width:t,height:e}}function getTextureScale(e,r,t){return{x:r/e.width,y:t/e.height}}function scaleByPixelRatio(e){var r=window.devicePixelRatio||1;return Math.floor(e*r)}function hashCode(r){if(0==r.length)return 0;let t=0;for(let e=0;e<r.length;e++)t=(t<<5)-t+r.charCodeAt(e),t|=0;return t}update(),document.addEventListener("mousedown",e=>{var r=scaleByPixelRatio(e.clientX),e=scaleByPixelRatio(e.clientY);let t=pointers.find(e=>-1==e.id);null==t&&(t=new pointerPrototype),updatePointerDownData(t,-1,r,e)}),document.addEventListener("mousemove",e=>{var r=pointers[0];r.down&&updatePointerMoveData(r,scaleByPixelRatio(e.clientX),scaleByPixelRatio(e.clientY))}),window.addEventListener("mouseup",()=>{updatePointerUpData(pointers[0])}),canvas.addEventListener("touchstart",e=>{e.preventDefault();for(var r=e.targetTouches;r.length>=pointers.length;)pointers.push(new pointerPrototype);for(let e=0;e<r.length;e++){var t=scaleByPixelRatio(r[e].pageX),i=scaleByPixelRatio(r[e].pageY);updatePointerDownData(pointers[e+1],r[e].identifier,t,i)}}),canvas.addEventListener("touchmove",e=>{e.preventDefault();var r=e.targetTouches;for(let e=0;e<r.length;e++){var t=pointers[e+1];t.down&&updatePointerMoveData(t,scaleByPixelRatio(r[e].pageX),scaleByPixelRatio(r[e].pageY))}},!1),window.addEventListener("touchend",e=>{const t=e.changedTouches;for(let r=0;r<t.length;r++){var i=pointers.find(e=>e.id==t[r].identifier);null!=i&&updatePointerUpData(i)}}),window.addEventListener("keydown",e=>{"KeyP"===e.code&&(guide_bg_config.PAUSED=!guide_bg_config.PAUSED)," "===e.key&&splatStack.push(parseInt(20*Math.random())+5)});