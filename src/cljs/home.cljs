(ns home 
  (:require [sketch :as s]
            [home.icon :as icon]))


(defn draw-icon [r]
  (doall
    (for [[a b] icon/lines]
      (let [[x1 y1] a
            [x2 y2] b]
        (s/line x1 y1 x2 y2 {:stroke "black" :rotate r}))))) 
  
(defn draw [t]
  (s/scoped draw-icon {:translate [500 500] :rotate t})
  (s/scoped draw-icon {:translate (s/center) :rotate (s/time)}))

(s/run
  {:clear? true
   :size :auto
   :seed 0 
   :update (fn [m] (+ m (s/delta)))
   :draw draw})
