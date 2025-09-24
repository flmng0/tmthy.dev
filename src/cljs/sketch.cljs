(ns sketch) 

(def state (atom nil))

(defn- init-state []
  (let [canvas (js/document.getElementById "sketchCanvas")
        context (.getContext canvas "2d")]
    {:time 0 :frame 0 :context context}))

(def default-size [500 500])

(defn- auto-size 
  "Synchronise canvas size with element's DOM size" 
  []
  (fn handle-resize []
    (let [cvs (canvas)
          w (.-clientWidth cvs)
          h (.-clientHeight cvs)]
      (resize w h)))
  (js/window.addEventListener "resize" handle-resize)
  (handle-resize))
      
(defn run
  [{update-fn :update :keys [draw clear? clear-color seed size]}]
  (when update-fn (assert seed) ":seed state expected when using :update")

  ; Set initial state
  (when (nil? @state) (reset! state (init-state)))

  ; Resize canvas to desired size
  (if (= size :auto)
    (auto-size)
    (resize (or size default-size)))

  ; Add the seed model value if provided
  (when update-fn (swap! state assoc :model seed))

  (fn tick [t]
    (if (nil? (:start @state))
      (swap! state assoc :start t)
      (swap! state assoc :time (- t (:start @state))))
      
    (when update-fn
      (swap! state update :model update-fn))

    (when clear? (clear clear-color))
    (draw (:model @state))

    (swap! state update :frame inc)
    (js/window.requestAnimationFrame tick))
  
  (js/window.requestAnimationFrame tick))

(defn- context [] (:context @state))
(defn- canvas [] (.-canvas (context)))

; Constants and public getters
(def PI Math.PI)
(def TAU (* 2 PI))

(defn first-frame? []
  (zero? (:frame @state)))

(defn once [f]
  (when (first-frame?) (f)))

(defn rgb [r g b]
  (let [[r g b] (map #(* 255 (mod (or % 0) 1)) [r g b])]
    (str "rgb(" r "," g "," b ")")))

(defn spy [v] (println v) v)

(defn time [] (/ (:time @state) 1000))

(defn size [] ((juxt #(.-width %) #(.-height %)) (canvas)))

(defn resize 
  ([size]
   (if (seq? size)
     (apply resize size)
     (resize size size)))
  ([w h] 
   (let [cvs (canvas)]
     (set! (.-width cvs) w)
     (set! (.-height cvs) h))))

(defn center []
  (let [[w h] (size)] [(/ w 2) (/ h 2)]))
    


; Helpers for defining drawing methods
(defn- apply-opts [ctx {:keys [fill stroke stroke-width scale rotate translate]}]
  (when fill (set! (.-fillStyle ctx) fill))
  (when stroke (set! (.-strokeStyle ctx) stroke))
  (when stroke-width (set! (.-lineWidth ctx) stroke-width))
  (when scale 
    (let [[x y] (if (seq? scale) scale [scale scale]) 
          (.scale ctx x y)]))
  (when translate
    (let [[x y] translate]
      (.translate ctx x y)))
  (when rotate (.rotate ctx rotate)))

(defn- draw [opts {:keys [init fill stroke]}]
  (let [opts (apply merge opts)]
    (doto (context)
      (.save)
      (apply-opts opts)

      ((fn [ctx]
         (when init (init ctx))
         (when (and fill (:fill opts)) (fill ctx))
         (when (and stroke (:stroke opts)) (stroke ctx))))

      (.restore))))


; Drawing methods
(defn clear [color]
  (let [[w h] (size)]
    (if color 
      (rect 0 0 w h {:fill color})
      (.clearRect (context) 0 0 w h))))

(defn rect [x y w h & opts]
  (draw 
    opts
    {:fill #(.fillRect % x y w h)
     :stroke #(.strokeRect % x y w h)}))

(defn line [x1 y1 x2 y2 & opts]
  (draw
    opts
    {:init #(doto %
              (.beginPath)
              (.moveTo x1 y1)
              (.lineTo x2 y2))
     :stroke #(.stroke %)}))

(defn circle [x y r & opts]
  (draw 
    opts
    {:init #(doto %
              (.beginPath)
              (.arc x y r 0 TAU))
     :fill #(.fill %)
     :stroke #(.stroke %)})) 

