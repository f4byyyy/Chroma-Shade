/**
 * Creates and compiles a shader
 * @param {!WebGLRenderingContext} gl - the WebGL Context
 * @param {string} shaderSourceCode - the GLSL source code for the shader
 * @param {int} shaderType - the type of shader (`gl.VERTEX_SHADER` or `gl.FRAGMENT_SHADER`)
 * @return {!WebGLShader} the shader
 */
export function compileShader(gl, shaderSourceCode, shaderType) {
    
    let shader = gl.createShader(shaderType);

    gl.shaderSource(shader, shaderSourceCode);

    gl.compileShader(shader);
    
    let compilationSuccess = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if(!compilationSuccess) {
        throw("could not compile shader:" + gl.getShaderInfoLog(shader));
    }

    return shader;
}

/**
* Creates a program from 2 shaders
* @param {!WebGLRenderingContext} gl - the WebGL context
* @param {!WebGLShader} vertexShader - a vertex shader
* @param {!WebGLShader} fragmentShader - a fragment shader
* @return {!WebGLProgram} the program
*/
export function createProgram(gl, vertexShader, fragmentShader) {

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);

    let linkSuccess = gl.getProgramParameter(program, gl.LINK_STATUS);
    if(!linkSuccess) {
        throw("program failed to link:" + gl.getProgramInfoLog(program));
    }

    return program;
}


/**
 * Creates a program from 2 shader source code files
 * @param {!WebGLRenderingContext} gl - the WebGL context
 * @param {string} vertexSource - path of the vertex shader file
 * @param {string} fragmentSource - path of the fragment shader file
 * @return {!WebGLProgram} the program
 */
export async function createProgramFromFiles(gl, vertexSource, fragmentSource) {

    let vertexCode = await fetch(vertexSource).then((response) => response.text());

    let fragmentCode = await fetch(fragmentSource).then((response) => response.text());

    return createProgram(gl, compileShader(gl, vertexCode, gl.VERTEX_SHADER), compileShader(gl, fragmentCode, gl.FRAGMENT_SHADER));
}