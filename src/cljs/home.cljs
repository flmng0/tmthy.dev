(ns home
  (:require
   [home.hero :refer [run-hero]]
   [home.whimsy :refer [setup-whimsy]]))

(let [played? (.getItem sessionStorage :animation-played)]
  (run-hero played?)
  (if played?
    (.setAttribute (.-documentElement document) "data-played" "true"))
  (.setItem sessionStorage :animation-played true))
    
(setup-whimsy)
