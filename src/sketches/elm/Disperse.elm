module Disperse exposing (main)

import Sketch
import Debug

main =
  Sketch.run { init = init, update = update, draw = draw }

init =
  { x = 0
  , y = 0
  }

update t _ =
  let
    theta = t / pi
  in
  { x = (toFloat Sketch.width / 2) + 100 * cos theta
  , y = (toFloat Sketch.height / 2) + 100 * sin (2 * theta)
  }

draw { x, y } =
  [ (Sketch.clear "grey")
  , (Sketch.rect x y 20 20 |> Sketch.withFill "red")
  ]
