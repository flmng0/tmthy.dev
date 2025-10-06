(ns home.whimsy)

(def animations (atom []))

(defn tick [anims t]
  (for [{:keys [ticker reset start] :as anim} anims
        :let [start (or start t)
              done? (ticker (/ (- t start) 1000))]]
    (do
      (when (and done? (some? reset)) (reset))
      (assoc anim :start start :done? done?))))

(defn start-loop []
  (fn frame [t]
    (let [anims (swap! animations (comp vec (partial remove #(:done? %)) tick) t)]
      (when-not (empty? anims)
        (.requestAnimationFrame js/window frame))))
  (.requestAnimationFrame js/window frame))

(defn add-animation [anim]
  (when (empty? @animations) (start-loop))
  (swap! animations conj anim))

(defn hardhat [elem]
  (let [offset (- (* 2 (js/Math.random) 1))]
    {:ticker
     (fn [t]
       (let [r (* 360 t t)
             o (- 1 (/ t 2.0))
             a (- (* 2 t) 0.3)
             v (+ 0.4 (- (* a a)))
             x (* t -30.0)
             y (* v -40)]
         (set! (.-style.transform elem) (str "translate(" x "px," y "px) rotate(" r "deg)"))
         (set! (.-style.opacity elem) o)
         (> t 1.0)))
     :reset (fn []
              (set! (.-style.transform elem) nil)
              (set! (.-style.opacity elem) nil)
              (let [keyframes [{:transform "scale(0.3)" :opacity 0}
                               {:transform "scale(1.2)"}
                               {:transform "scale(1.0)" :opacity 1}]
                    options {:duration 600 :easing "ease-out"}]
                (.animate elem keyframes options)))}))

(defn setup-jiggle [elem]
  (fn wait []
    (+ 5000 (* 10000 (js/Math.random))))
  (fn jiggle []
    (let [keyframes [{:transform "rotate(-10deg)"}
                     {:transform "rotate(10deg)"}
                     {:transform "rotate(0deg)"}]
          options {:duration 500 :easing "ease-out"}] 
      (when (empty? @animations) (.animate elem keyframes options))
      (.setTimeout js/window jiggle (wait))))
  (.setTimeout js/window jiggle (wait)))

(def whimsy {:hardhat hardhat})

(defn setup-whimsy []
  (fn on-click [elem]
    (let [whimsy-key (.-dataset.whimsy elem)
          factory (get whimsy whimsy-key)]
      (add-animation (factory elem))))
  (doall
   (for [elem (.querySelectorAll js/document "button[data-whimsy]")]
     (do
       (setup-jiggle elem)
       (.addEventListener elem "click" (partial on-click elem))))))
      
