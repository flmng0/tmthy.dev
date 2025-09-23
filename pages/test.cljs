(ns test
  (:require [sketch :refer [run-sketch]]))


(run-sketch
  {:update (fn [{:keys [model]}] (inc model))
   :seed 0
   :draw (fn [{:keys [model] :as state}] 
           (when (zero? (rem model 50)) (println model)))})

