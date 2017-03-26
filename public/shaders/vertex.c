attribute float height;

uniform float delta; 

varying float vOpacity;
varying vec3 vNormal;


void main() { 

  vOpacity = height;
  vNormal = normal + sin(height);

  vec3 p = position; 

  p.z += height * cos(delta) * 50.0; 
  p.x += height * sin(delta) * 10.0; 

  vec4 modelViewPosition = modelViewMatrix * vec4(p, 1.0); 
  
  gl_Position = projectionMatrix * modelViewPosition;
}