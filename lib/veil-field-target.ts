/**
 * The DarkVeil field render target: a mipmapped texture attached to a
 * framebuffer. texStorage2D makes a texture's storage immutable, so a resize
 * (the mobile URL bar changes the veil's height) must create a new texture;
 * re-specifying the old one is INVALID_OPERATION and leaves the field drawn
 * into a texture of the wrong size.
 */
export type FieldTarget = {
  readonly texture: WebGLTexture | null;
  readonly framebuffer: WebGLFramebuffer | null;
  readonly width: number;
  readonly height: number;
  resize: (width: number, height: number) => void;
  dispose: () => void;
};

export function createFieldTarget(
  gl: WebGL2RenderingContext,
  { floatTargets }: { floatTargets: boolean },
): FieldTarget {
  const framebuffer = gl.createFramebuffer();
  let texture: WebGLTexture | null = null;
  let width = 0;
  let height = 0;

  return {
    get texture() {
      return texture;
    },
    framebuffer,
    get width() {
      return width;
    },
    get height() {
      return height;
    },
    resize(nextWidth, nextHeight) {
      if (texture && width === nextWidth && height === nextHeight) return;
      if (texture) gl.deleteTexture(texture);
      texture = gl.createTexture();
      width = nextWidth;
      height = nextHeight;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      const levels = Math.floor(Math.log2(Math.max(width, height))) + 1;
      gl.texStorage2D(gl.TEXTURE_2D, levels, floatTargets ? gl.RGBA16F : gl.RGBA8, width, height);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    },
    dispose() {
      if (texture) gl.deleteTexture(texture);
      texture = null;
      gl.deleteFramebuffer(framebuffer);
    },
  };
}
