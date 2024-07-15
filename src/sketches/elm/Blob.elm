module Blob exposing (main)

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


type alias Neighbours a =
    { left : a
    , right : a
    }


cycle : Int -> List a -> List a
cycle n l =
    let
        i =
            if n < 0 then
                List.length l + n

            else
                n
    in
    List.drop i l ++ List.take i l


withNeighbours : List a -> List ( a, Neighbours a )
withNeighbours ps =
    let
        join p l r =
            ( p, { left = l, right = r } )
    in
    List.map3 join ps (cycle -1 ps) (cycle 1 ps)


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
    1000.0


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
    700.0


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


attractionStrength : Float
attractionStrength =
    2000.0


maxAttractDistance : Float
maxAttractDistance =
    1000.0


neighbourAttractionForce : Neighbours Particle -> Particle -> Vec2
neighbourAttractionForce { left, right } p =
    let
        attract q =
            let
                diff =
                    V2.sub q.position p.position

                toQ =
                    V2.normalize diff

                scale =
                    V2.length diff / maxAttractDistance
            in
            V2.scale (scale * attractionStrength) toQ
    in
    V2.add (attract left) (attract right)


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


updateParticle : State -> Neighbours Particle -> Particle -> Particle
updateParticle s ns p =
    let
        mousePos =
            V2.vec2 s.mouse.x s.mouse.y

        sumOfForces =
            List.foldl V2.add
                zero
                [ repelForce mousePos p
                , frictionForce p
                , returnForce p
                , neighbourAttractionForce ns p
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


type alias Model =
    { particles : List Particle
    , neighbours : List (Neighbours Particle)
    }


init : Model
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

        ( particles, neighbours ) =
            List.map makeParticle (List.range 1 count) |> withNeighbours |> List.unzip
    in
    { particles = particles, neighbours = neighbours }


update : State -> Model -> Model
update state { particles, neighbours } =
    let
        newParticles =
            List.map2 (\ns -> updateParticle state ns) neighbours particles
    in
    { particles = newParticles, neighbours = neighbours }


drawBlob particles =
    List.map (\p -> ( V2.getX p.position, V2.getY p.position )) particles
        |> polygon
        |> withFill "#fff"


draw : Model -> List DrawCmd
draw { particles } =
    [ clear "#111", drawBlob particles ]
