(ns home 
  (:require [sketch :as s]
            [home.icon :as icon]))

(def tile-size 20)

(defn draw []
  (doall
    (for [[a b] icon/lines]
      (let [[x1 y1] a
            [x2 y2] b]
        (s/once #(println x1 y1))
        (s/line x1 y1 x2 y2 
                {:stroke "black"
                 :rotate (* (s/time) s/PI)
                 :translate (s/center)})))))

(s/run
  {:clear? true
   :size :auto
   :draw draw})
