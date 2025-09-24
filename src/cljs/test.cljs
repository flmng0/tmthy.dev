(ns test [:require [sketch :as s]])

(defn draw []
  (let [opts {:stroke "black" :stroke-width 2}
        [cx cy] (s/center)]
    (s/circle 20 20 10 opts)
    (s/rect cx cy 20 20 opts {:fill "blue"})))

(s/run 
  {:clear? true
   :clear-color "#eee"
   :size :auto
   :draw draw})

