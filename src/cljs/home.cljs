(ns home 
  (:require 
    [sketch :as s]
    [home.icon :as icon]
    [util :refer [map-values clamp mapn]]))

(defn point->id [p] (str p))
(defn points-equal? [a b]
  (zero? (compare a b)))

(defn collect-points [lines]
  (reduce conj {} (map (juxt point->id identity) (.flat lines))))

(defn dist-sq [a b]
  (let [[dx dy] (mapv - a b)] 
    (+ (* dx dx) (* dy dy))))

(defn dist [a b]
    (js/Math.sqrt (dist-sq a b)))

(defn collect-connections [points lines]
  (mapv 
    (fn [[a b]] 
      (let [aid (point->id a)
            bid (point->id b)
            d (dist a b)]
        [aid bid d]))
    lines))

(defn make-particle [p]
  {:pos (mapv parseFloat p) 
   :vel [0 0] 
   :acc [0 0]})

(defn seed []
  (let [points (collect-points icon/lines)
        connections (collect-connections points icon/lines)
        particles (map-values make-particle points)]
    {:connections connections
     :particles particles}))


(defn draw-icon [r]
  (doall
    (for [[a b] icon/lines]
      (let [[x1 y1] a
            [x2 y2] b]
        (s/line x1 y1 x2 y2 {:stroke "black" :rotate r}))))) 

(defn draw-connection [pa pb dd]
  (let [[x1 y1] (:pos pa)
        [x2 y2] (:pos pb)
        width (-> dd
                  (clamp 0.01 100)
                  (mapn 0.01 100 2 0.01))]
    (s/line x1 y1 x2 y2 {:stroke "black" :stroke-width width :translate (s/center)})))
  
(defn draw [{:keys [particles connections]}]
  (draw-icon 0)
  (doall 
    (for [[a b d] connections]
      (let [pa (get particles a)
            pb (get particles b)
            d' (dist (:pos pa) (:pos pb))
            dd (Math.abs (- d' d))]
        (draw-connection pa pb dd)))))
        
  

(s/run
  {:clear? true
   :size :auto
   :seed seed 
   :draw draw})
