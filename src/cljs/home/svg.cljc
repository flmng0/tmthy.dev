(ns home.svg)

(defn- parse-part
  [[_ command x y]]
  {:command command :x x :y y})

(defn- extract-connections [path]
  (loop [parts (->> path
                 (re-seq #"([A-Z])([\d\.]+) ([\d\.]+)")
                 (map parse-part))
         aux nil
         lines []]
    (if (empty? parts)
      lines
      (let [{:keys [command x y]} (first parts)]
        (case command
          "M" (recur (rest parts) [x y] lines)
          "L" (recur (rest parts) [x y] (conj lines [aux [x y]])))))))

(defmacro parse-path [path]
  (extract-connections path))
  
