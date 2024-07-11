module Disperse exposing (main)

import Debug
import Math.Vector2 as V2 exposing (Vec2)
import Sketch exposing (..)


main =
    Sketch.run { init = init, update = update, draw = draw }


type alias Particle =
    { origin : Vec2
    , position : Vec2
    , velocity : Vec2
    , acceleration : Vec2
    }


zero : Vec2
zero =
    V2.vec2 0 0


returnStrength : Float
returnStrength =
    20.0


frictionStrength : Float
frictionStrength =
    1.0


particle : Vec2 -> Particle
particle o =
    { origin = o, position = o, velocity = zero, acceleration = zero }


applyForce : Vec2 -> Particle -> Particle
applyForce f p =
    { p | acceleration = V2.add f p.acceleration }


applyReturnForce : Particle -> Particle
applyReturnForce p =
    let
        rf =
            V2.sub p.origin p.position |> V2.scale returnStrength
    in
    applyForce rf p


applyFriction : Particle -> Particle
applyFriction p =
    let
        ff =
            p.velocity |> V2.negate |> V2.scale frictionStrength
    in
    applyForce ff p


minRepelDistance : Float
minRepelDistance =
    50.0


minRepelDistanceSquared : Float
minRepelDistanceSquared =
    minRepelDistance * minRepelDistance


repelStrength : Float
repelStrength =
    0.001


maybeRepel : Vec2 -> Particle -> Particle
maybeRepel m p =
    let
        diff =
            V2.sub p.position m

        dd =
            V2.lengthSquared diff
    in
    if dd > minRepelDistanceSquared then
        p

    else
        let
            d =
                sqrt dd

            inverse =
                1 - d / minRepelDistance

            away =
                V2.scale (inverse * repelStrength) diff

            newVel =
                V2.add p.velocity away
        in
        { p | velocity = newVel }


integrate : Float -> Particle -> Particle
integrate dt p =
    let
        vel =
            V2.scale dt p.acceleration |> V2.add p.velocity

        pos =
            V2.scale dt vel |> V2.add p.position
    in
    { p | position = pos, velocity = vel, acceleration = zero }


updateParticle : State -> Particle -> Particle
updateParticle s p =
    let
        mousePos =
            V2.vec2 s.mouse.x s.mouse.y
    in
    p
        |> maybeRepel mousePos
        |> applyReturnForce
        |> applyFriction
        |> integrate s.dt


drawParticle : Particle -> DrawCmd
drawParticle p =
    let
        { x, y } =
            V2.toRecord p.position
    in
    circle 5 |> withFill "white" |> move x y


centerVec =
    V2.vec2 (toFloat width / 2) (toFloat height / 2)


init =
    let
        aux n i particles =
            if i == n then
                particles

            else
                let
                    theta =
                        (toFloat i / toFloat n) * pi * 2

                    x =
                        cos theta

                    y =
                        sin theta

                    p =
                        particle (V2.vec2 x y |> V2.scale 100 |> V2.add centerVec)
                in
                aux n (i + 1) (p :: particles)
    in
    aux 10 0 []


update state particles =
    List.map (updateParticle state) particles


draw particles =
    -- let
    --     drawPoint ( x, y ) =
    --         circle 5
    --             |> withFill "#fff"
    --             |> center
    --             |> move (100 * x) (100 * y)
    --
    --     drawPoints =
    --         List.map drawPoint points
    -- in
    clear "#111" :: List.map drawParticle particles
