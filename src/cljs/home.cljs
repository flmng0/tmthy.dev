(ns home [:require [sketch :as s]])

(def tile-size 20)

(defn draw []
  (let [[cw ch] (s/size)
        w (/ cw tile-size)
        h (/ ch tile-size)]
    (doall 
      (for [x (range w)
            y (range h)]
        (s/rect (* x tile-size) (* y tile-size) 
                tile-size tile-size 
                {:fill (s/rgb (/ x w) (/ y h))})))))

(s/run
  {:clear? true
   :size :auto
   :draw draw})
