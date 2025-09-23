module Test exposing (main)

import Sketch2D exposing (..)


main =
    Sketch2D.run () { update = update, draw = draw }


update state () =
    ()


draw () =
    [ fill ( 1.0, 0.0, 0.0 )
    , noStroke
    , drawAt (rect 10 10) 10 10
    , drawAt (circle 20) 50 50
    ]
