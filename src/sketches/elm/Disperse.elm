module Disperse exposing (main)

import Sketch exposing (..)
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
  { x = 100 * cos theta
  , y = 100 * sin (2 * theta)
  }

draw { x, y } =
  [ clear "grey"
  , rect x y 20 20 |> withFill "red" |> center
  , circle -x -y 20 |> withFill "blue" |> center
  ]
