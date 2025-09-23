(ns sketch)


(defn run-sketch
  [{update-fn :update :keys [draw clear seed]}]
  (when update-fn (assert seed) ":seed state expected when using :update")
  (fn tick [state t]
    (let [state (if (nil? state)
                  {:start t :t 0 :model seed}
                  (assoc state :t (- t (:start state))))

          state (when update-fn 
                  (update state :model (partial update-fn state)))]

      (draw state)
      (js/window.requestAnimationFrame (partial tick state))))
  
  (js/window.requestAnimationFrame (partial tick nil)))
    
