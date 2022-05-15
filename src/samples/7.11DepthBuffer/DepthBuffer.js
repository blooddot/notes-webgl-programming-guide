var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Matrix4 } from "../../libs/cuon-matrix.js";
import { initWebGL } from "../../utils/util.js";
/**
 * @author 雪糕
 * @description
 */
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const { gl, program, canvas } = yield initWebGL("DepthBuffer");
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //清空<canvas>
        const n = initVertexBuffers(gl, program);
        const projMatrix = new Matrix4();
        projMatrix.setPerspective(30, canvas.width / canvas.height, 1, 100);
        const viewMatrix = new Matrix4();
        viewMatrix.setLookAt(0, 0, 5, 0, 0, -100, 0, 1, 0);
        const modelMatrix = new Matrix4();
        modelMatrix.setTranslate(0.75, 0, 0); //平移 0.75 单位
        const mvpMatrix = new Matrix4();
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        const u_MvpMatrix = gl.getUniformLocation(program, 'u_MvpMatrix');
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements); //将视图矩阵传给 u_ViewMatrix 变量
        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制右侧的一组三角形
        modelMatrix.setTranslate(-0.75, 0, 0); //平移 -0.75 单位
        mvpMatrix.set(projMatrix).multiply(viewMatrix).multiply(modelMatrix);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements); //将视图矩阵传给 u_ViewMatrix 变量
        gl.drawArrays(gl.TRIANGLES, 0, n); //绘制左侧的一组三角形
    });
};
function initVertexBuffers(gl, program) {
    const verticesColors = new Float32Array([
        // Three triangles on the right side
        0.0, 1.0, 0.0, 0.4, 0.4, 1.0,
        -0.5, -1.0, 0.0, 0.4, 0.4, 1.0,
        0.5, -1.0, 0.0, 1.0, 0.4, 0.4,
        0.0, 1.0, -4.0, 0.4, 1.0, 0.4,
        -0.5, -1.0, -4.0, 0.4, 1.0, 0.4,
        0.5, -1.0, -4.0, 1.0, 0.4, 0.4,
        0.0, 1.0, -2.0, 1.0, 1.0, 0.4,
        -0.5, -1.0, -2.0, 1.0, 1.0, 0.4,
        0.5, -1.0, -2.0, 1.0, 0.4, 0.4,
    ]);
    const n = 18;
    const vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, verticesColors, gl.STATIC_DRAW);
    const F_SIZE = verticesColors.BYTES_PER_ELEMENT;
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, F_SIZE * 6, 0); //将缓冲区对象分配给 a_Position 变量
    gl.enableVertexAttribArray(a_Position); //连接 a_Position 变量与分配给它的缓冲区对象
    const a_Color = gl.getAttribLocation(program, 'a_Color');
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, F_SIZE * 6, F_SIZE * 3);
    gl.enableVertexAttribArray(a_Color);
    gl.bindBuffer(gl.ARRAY_BUFFER, null); //取消绑定的缓冲区对象
    return n;
}
