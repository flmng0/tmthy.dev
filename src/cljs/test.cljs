(ns test [:require [sketch :as s]])

(defn draw []
  ((juxt 
     #(s/circle 20 20 10 %)
     #(s/rect 250 250 20 20 %))
   {:stroke "black" :stroke-width 2}))

(s/run 
  {:clear? true
   :draw draw})
