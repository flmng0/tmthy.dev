(ns home 
  (:require [sketch :as s]
            [home.icon :as icon]))

(defn point->id [p] (str p))
(defn points-equal? [a b]
  (zero? (compare a b)))

(defn collect-points [lines]
  (reduce conj {} (map (juxt point->id identity) (.flat lines))))

(defn collect-connections [points lines]
  (map (partial mapv point->id) lines))

(defn make-particle [id p]
  {:id id 
   :pos (mapv parseFloat p) 
   :vel [0 0] 
   :acc [0 0]})

(defn seed []
  (let [points (collect-points icon/lines)
        connections (collect-connections points icon/lines)
        particles (mapv (partial apply make-particle) points)]
    (println particles)))

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
   :seed seed 
   :draw draw})
