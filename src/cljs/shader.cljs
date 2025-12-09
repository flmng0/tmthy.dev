(ns shader
  (:require [sketch :as s]))

(defn- start-shader [fragSource]
  (console.log fragSource))

(defn runShader [href]
  (-> (fetch href)
      (.then #(.text %))
      (.then #(start-shader %))))

