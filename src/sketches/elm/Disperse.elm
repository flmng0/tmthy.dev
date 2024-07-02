module Disperse exposing (main)

import Sketch exposing (..)
import Debug

main =
  Sketch.run { init = init, update = update, draw = draw }

init =
  let 
    aux n i points =
      if i == n then points
      else
        let
          theta = (toFloat i / toFloat n) * pi * 2
          x = cos theta
          y = sin theta
          point = (x, y)
        in
        aux n (i + 1) (point :: points)
  in
  aux 10 0 []
  
update _ model = model

draw points =
  let 
      drawPoint (x, y) = 
        circle 5 
        |> withFill "#fff" 
        |> center 
        |> move (100 * x) (100 * y) 

      drawPoints = List.map drawPoint points
  in
  clear "#111" :: drawPoints
