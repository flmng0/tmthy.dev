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
    theta = 2 * t / pi
  in
  { x = 150 * cos theta
  , y = 50 * sin (2 * theta)
  }

draw { x, y } =
  [ clear "#111"
  , rect 20 20 |> withFill "#282a36" |> withStroke "#eee" 1.0 |> center |> move x y
  , circle 20 |> withFill "rebeccapurple" |> center |> move -x -y
  ]
