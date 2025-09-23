(ns test
  (:require [sketch :refer [run-sketch]]))

(run-sketch 
  nil
  (fn [state model]
    (println model)
    ))
    
    
