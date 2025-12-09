(ns shader
  (:require
    [sketch :as s]))

(def vert-src
 "attribute vec2 aVertPos;
void main() {
    gl_Position = vec4(aVertPos, 0.0, 1.0);
}")

(defn compile-shader [gl src t]
  (let [s (.createShader gl t)
        status (doto gl
                 (.shaderSource s src)
                 (.compileShader s)
                 (.getShaderParameter s (.-COMPILE_STATUS gl)))]
    (if (not status)
      (throw (js/Error. "Failed to compile shader"))
      s)))

(defn compile-shader-program [gl vs fs]
  (let [prog (.createProgram gl)
        v (compile-shader gl vs (.-VERTEX_SHADER gl))
        f (compile-shader gl fs (.-FRAGMENT_SHADER gl))
        status (doto gl
                (.attachShader prog v)
                (.attachShader prog f)
                (.linkProgram prog)
                (.getProgramParameter prog (.-LINK_STATUS gl)))]
    (if (not status)
      (throw (js/Error. "Failed to link shader program"))
      prog)))
  
(defn- draw [& args])

(defn- update-uniforms [m] m)

(defn- start-shader [frag-src]
  (fn seed []
    (let [gl (s/context)
          shader (compile-shader-program gl vert-src frag-src)]
     {:shader shader}))

  (s/run {:seed seed
          :update update-uniforms
          :draw draw
          :context-type "webgl2"}))

(defn runShader [frag-path]
  (-> (fetch frag-path)
      (.then #(.text %))
      (.then #(start-shader %))))
