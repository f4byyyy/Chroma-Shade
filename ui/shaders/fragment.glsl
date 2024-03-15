#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float zoom;
uniform int iterations;
uniform bool noise;
uniform bool frostedNoise;
uniform vec3 baseColor;

out vec4 outColor;

//modified version of this shadertoy by nmz: https://www.shadertoy.com/view/4tfSRj

float random(vec2 uv)
{
	return fract(sin(dot(uv, vec2(12.9898,78.233)))*43758.5453123);
}

float f(vec2 p)
{
    return sin(p.x+sin(p.y+iTime*0.1)) * sin(p.y*p.x*0.1+iTime*0.2);
}

//the vector field:
vec2 field(vec2 p)
{
	vec2 ep = vec2(.05,0.);
    vec2 rz = vec2(0);
	for(int i = 0; i < iterations; i++)
	{
		float t0 = f(p);
		float t1 = f(p + ep.xy);
		float t2 = f(p + ep.yx);
        vec2 g = vec2((t1-t0), (t2-t0))/ep.xx;
		vec2 t = vec2(-g.y,g.x);
        
		if(frostedNoise) {
			p += (0.9 + (random(gl_FragCoord.xy) * 0.1)) * t + g * (0.3 + (random(gl_FragCoord.xy) * 0.1));
		} else {
			p += 0.9 * t + g * 0.3; //0.9 and 0.3 can be changed slightly
		}
		//p += 0.99 * t + g * 0.3; //0.9 and 0.3 can be changed slightly

        rz = t;
	}
    
    return rz;
}

void main()
{
	vec2 p = (gl_FragCoord.xy / iResolution) - 0.5;
	p.x *= iResolution.x / iResolution.y;
    p *= 10.0 * (2.55 - (zoom + 0.55));
	
    vec2 fld = field(p);

	//vec3 baseColor = vec3(-0.3, 0.1, 0.5);
    vec3 col = sin(baseColor + fld.x - fld.y) * 0.65 + 0.35;
  
    //col = sin(vec3(-.3,0.1,0.5)+(gl_FragCoord.xy / iResolution).y * 10.0 - 1.0)*0.65+0.35; //color test

	if(noise) {
		col += vec3((random(gl_FragCoord.xy * iTime) - 0.5) * 0.1);
	}
	
	outColor = vec4(col, 1.0);
}