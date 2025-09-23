(ns sketch)

(defn run-sketch [seed draw]
  (fn tick [state model t]
    (let [state (if (nil? state) 
                  {:startTime t :t 0}
                  (assoc state :t (- t (:startTime state))))
          new-model (draw state model)]
      (js/window.requestAnimationFrame (partial tick state new-model))))
  
  (js/window.requestAnimationFrame (partial tick nil seed))) 
  
