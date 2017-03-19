
uniform float delta; 

varying float vOpacity;


void main() { 

  float r = 0.0;
  float g = 0.5; 
  float b = 1.0; 
  
  gl_FragColor = vec4(r, g, b, vOpacity); 
}