module Disperse exposing (main)

import Debug
import Math.Vector2 as V2 exposing (Vec2)
import Sketch exposing (..)


main =
    Sketch.run { init = init, update = update, draw = draw }


type alias Particle =
    { origin : Vec2
    , position : Vec2
    , oldPosition : Vec2
    }


zero : Vec2
zero =
    V2.vec2 0 0


particle : Vec2 -> Particle
particle pos =
    { origin = pos
    , position = pos
    , oldPosition = pos
    }


minRepelDistance : Float
minRepelDistance =
    100.0


minRepelDistanceSquared : Float
minRepelDistanceSquared =
    minRepelDistance * minRepelDistance


repelStrength : Float
repelStrength =
    30000.0


repelForce : Vec2 -> Particle -> Vec2
repelForce m p =
    let
        diff =
            V2.sub p.position m

        dd =
            V2.lengthSquared diff
    in
    if dd > minRepelDistanceSquared then
        zero

    else
        let
            -- TODO: Simplify
            dist =
                sqrt dd

            away =
                V2.scale (1.0 / dist) diff

            inverse =
                -- Strength of repel is lower the further the mouse is
                1 - (dist / minRepelDistance)

            force =
                V2.scale (inverse * repelStrength) away
        in
        force


frictionStrength : Float
frictionStrength =
    300.0


{-| Simple force from the current position towards the previous
-}
frictionForce : Particle -> Vec2
frictionForce p =
    V2.sub p.oldPosition p.position |> V2.scale frictionStrength


returnStrength : Float
returnStrength =
    500.0


maxOriginDistance : Float
maxOriginDistance =
    250.0


returnForce : Particle -> Vec2
returnForce p =
    if p.origin == p.position then
        zero

    else
        let
            diff =
                V2.sub p.origin p.position

            toOrigin =
                V2.normalize diff

            scale =
                (V2.length diff / maxOriginDistance) ^ 2
        in
        V2.scale (scale * repelStrength) toOrigin


{-| Verlet integration implementation
-}
integrate : Vec2 -> Float -> Particle -> Particle
integrate sumOfForces dt p =
    let
        twoP =
            V2.scale 2 p.position

        acc =
            V2.scale (dt * dt) sumOfForces

        newPos =
            V2.sub twoP p.oldPosition |> V2.add acc
    in
    { p | position = newPos, oldPosition = p.position }


updateParticle : State -> Particle -> Particle
updateParticle s p =
    let
        mousePos =
            V2.vec2 s.mouse.x s.mouse.y

        sumOfForces =
            List.foldl V2.add
                zero
                [ repelForce mousePos p
                , frictionForce p
                , returnForce p
                ]
    in
    integrate sumOfForces s.dt p


centerVec : Vec2
centerVec =
    V2.vec2 (toFloat width / 2) (toFloat height / 2)


radius : Float
radius =
    150


count : Int
count =
    200


init : List Particle
init =
    let
        makeParticle i =
            let
                theta =
                    (toFloat i / toFloat count) * pi * 2

                ( x, y ) =
                    fromPolar ( radius, theta )
            in
            particle (V2.vec2 x y |> V2.add centerVec)
    in
    List.map makeParticle (List.range 1 count)


update : State -> List Particle -> List Particle
update state particles =
    List.map (updateParticle state) particles


drawBlob particles =
    List.map (\p -> ( V2.getX p.position, V2.getY p.position )) particles
        |> polygon
        |> withFill "#fff"


draw : List Particle -> List DrawCmd
draw particles =
    [ clear "#111", drawBlob particles ]
