module Disperse exposing (main)

import Sketch
import Debug

main =
  Sketch.run { init = 0, update = update, draw = draw }

update t _ =
  t

draw _ =
  [ (Sketch.rect 30 10 20 20 |> Sketch.withFill "red")
  ]
