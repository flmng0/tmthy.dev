port module Sketch exposing (..)

import Browser
import Browser.Events
import Html as H
import Html.Attributes as HA
import Html.Events as HE
import Json.Decode as D
import Json.Encode as E
import Platform
import Time


port submitFrame : E.Value -> Cmd msg


port tick : (Float -> msg) -> Sub msg


port mouseMove : (( Float, Float ) -> msg) -> Sub msg


type alias State =
    { t : Float
    , dt : Float
    , width : Int
    , height : Int
    , mouse : MouseState -- TODO: keyboard : KeyboardState
    }


type alias MouseState =
    { x : Float
    , y : Float
    , buttons : Int
    }


type Shape
    = Line Float Float
    | Rect Float Float
    | Circle Float
    | Polygon (List ( Float, Float ))


type alias DrawCmdInner =
    { shape : Shape
    , position : { x : Float, y : Float }
    , strokeWidth : Float
    , strokeColor : String
    , fillColor : String
    }


type DrawCmd
    = DrawCmd DrawCmdInner


type alias Config model =
    { init : model
    , update : State -> model -> model
    , draw : model -> List DrawCmd
    }


type Message
    = Tick Float
    | MouseMoved ( Float, Float )


drawShape : Shape -> DrawCmd
drawShape s =
    DrawCmd
        { shape = s
        , position = { x = 0.0, y = 0.0 }
        , strokeWidth = 0.0
        , strokeColor = "transparent"
        , fillColor = "black"
        }


clear : String -> DrawCmd
clear color =
    DrawCmd
        { shape = Rect (toFloat width) (toFloat height)
        , position = { x = 0.0, y = 0.0 }
        , strokeWidth = 0.0
        , strokeColor = "transparent"
        , fillColor = color
        }


line : Float -> Float -> Float -> Float -> DrawCmd
line x1 y1 x2 y2 =
    let
        dx =
            x2 - x1

        dy =
            y2 - y1
    in
    drawShape (Line dx dy) |> move x1 y1


rect : Float -> Float -> DrawCmd
rect w h =
    drawShape (Rect w h)


circle : Float -> DrawCmd
circle r =
    drawShape (Circle r)


polygon : List ( Float, Float ) -> DrawCmd
polygon ps =
    drawShape (Polygon ps)


withFill : String -> DrawCmd -> DrawCmd
withFill f dc =
    let
        i =
            inner dc
    in
    DrawCmd { i | fillColor = f }


withStroke : String -> Float -> DrawCmd -> DrawCmd
withStroke sc sw dc =
    dc
        |> withStrokeColor sc
        |> withStrokeWidth sw


withStrokeColor : String -> DrawCmd -> DrawCmd
withStrokeColor s dc =
    let
        i =
            inner dc
    in
    DrawCmd { i | strokeColor = s }


withStrokeWidth : Float -> DrawCmd -> DrawCmd
withStrokeWidth w dc =
    let
        i =
            inner dc
    in
    DrawCmd { i | strokeWidth = w }


move : Float -> Float -> DrawCmd -> DrawCmd
move dx dy dc =
    let
        i =
            inner dc

        x =
            i.position.x + dx

        y =
            i.position.y + dy

        p =
            { x = x, y = y }
    in
    DrawCmd { i | position = p }


center : DrawCmd -> DrawCmd
center =
    move (toFloat width / 2) (toFloat height / 2)


inner : DrawCmd -> DrawCmdInner
inner dc =
    case dc of
        DrawCmd i ->
            i


run : Config model -> Program Float ( State, model ) Message
run config =
    let
        mouse : MouseState
        mouse =
            { x = 0.0
            , y = 0.0
            , buttons = 0
            }

        state : Float -> State
        state t =
            { t = t
            , dt = 0.0
            , width = 600
            , height = 600
            , mouse = mouse
            }

        init t =
            ( ( state t, config.init ), Cmd.none )
    in
    Platform.worker { init = init, update = update config, subscriptions = subscriptions }


update : Config model -> Message -> ( State, model ) -> ( ( State, model ), Cmd Message )
update config msg ( state, model ) =
    case msg of
        Tick t ->
            let
                newState =
                    { state | t = t, dt = t - state.t }

                newModel =
                    config.update newState model

                cmds =
                    config.draw newModel |> encodeDrawCmdAll
            in
            ( ( newState, newModel ), submitFrame cmds )

        MouseMoved ( x, y ) ->
            let
                mouse =
                    state.mouse

                newMouse =
                    { mouse | x = x, y = y }

                newState =
                    { state | mouse = newMouse }
            in
            ( ( newState, model ), Cmd.none )


encodeDrawCmdAll : List DrawCmd -> E.Value
encodeDrawCmdAll cmds =
    E.list encodeDrawCmd cmds


encodeDrawCmd : DrawCmd -> E.Value
encodeDrawCmd cmd =
    let
        i =
            inner cmd
    in
    E.object
        [ ( "shape", encodeShape i )
        , ( "strokeWidth", E.float i.strokeWidth )
        , ( "strokeColor", E.string i.strokeColor )
        , ( "fillColor", E.string i.fillColor )
        ]


encodeShape : DrawCmdInner -> E.Value
encodeShape { shape, position } =
    let
        { x, y } =
            position

        ( type_, arguments ) =
            case shape of
                Line dx dy ->
                    let
                        x2 =
                            x + dx

                        y2 =
                            y + dy
                    in
                    ( "line", [ x, y, x2, y2 ] )

                Rect w h ->
                    ( "rect", [ x, y, w, h ] )

                Circle r ->
                    ( "circle", [ x, y, r ] )

                Polygon points ->
                    ( "polygon", List.concatMap (\( px, py ) -> [ px, py ]) points )
    in
    E.object
        [ ( "type", E.string type_ )
        , ( "arguments", E.list E.float arguments )
        ]


subscriptions : model -> Sub Message
subscriptions _ =
    Sub.batch [ tick Tick, mouseMove MouseMoved ]


width : Int
width =
    600


height : Int
height =
    600


onMouseMove : (( Float, Float ) -> msg) -> H.Attribute msg
onMouseMove tagger =
    HE.on "mousemove" (D.map tagger offsetPosition)


offsetPosition : D.Decoder ( Float, Float )
offsetPosition =
    D.map2 Tuple.pair
        (D.field "offsetX" D.float)
        (D.field "offsetY" D.float)



-- This is here just so that the project builds.


main =
    H.text "How are you seeing this?"
