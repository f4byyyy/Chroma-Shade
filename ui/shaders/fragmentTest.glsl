#version 300 es

precision highp float;

uniform vec2 iResolution;
uniform float iTime;
uniform float zoom;

out vec4 outColor;

float f(vec2 p)
{
    return sin(p.x - p.y*p.x*0.1 + iTime*0.1) * sin(p.x + sin(p.x - p.y+iTime*0.7));
	//return sin(p.x+sin(p.y+iTime*0.1)) * sin(p.y*p.x*0.1+iTime*0.2);
}

float random(vec2 uv)
{
	return fract(sin(dot(uv, vec2(12.9898,78.233)))*43758.5453123);
}

vec2 field(vec2 p)
{
	vec2 ep = vec2(.05,0.);
    vec2 rz = vec2(0);

	//int num = int(round(f(p) * 9.0)) + 1;

	for( int i=0; i<7; i++ )
	{
		float t0 = f(p);
		float t1 = f(p + ep.xy);
		float t2 = f(p + ep.yx);
        vec2 g = vec2((t1-t0), (t2-t0))/ep.xx;
		vec2 t = vec2(-g.y,g.x);
        
        p += .9*t + g*0.3;
        rz= t;
	}
    
    return rz;
}

void main()
{
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
	//float shade = pattern(uv);
	vec2 p = (uv - vec2(0.5, -0.2)) * (10.0 * (2.55 - zoom));

	vec2 fld = field(p);
    vec3 col = sin(vec3(-.3,0.1,0.5)+fld.x-fld.y)*0.65+0.35;

	//col = vec3(fld, 0.0);

    outColor = vec4(col, 1.0);
}