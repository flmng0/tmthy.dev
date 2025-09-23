port module Sketch2D exposing (circle, drawAt, fill, lineTo, noStroke, rect, run, stroke, text)

import Json.Encode as E
import Math.Matrix4 as M4 exposing (Mat4)
import Math.Vector2 as V2 exposing (Vec2)


port tick : (Float -> msg) -> Sub msg


port setup : E.Value -> Cmd msg


port draw : E.Value -> Cmd msg


type Msg
    = Tick Float


type Shape
    = Text String
    | Rect ( Float, Float )
    | Circle Float
    | LineTo Vec2


type alias Color =
    ( Float, Float, Float )


type Object
    = Object { position : Vec2, shape : Shape }


type DrawCommand
    = Draw Object
    | SetTransform Mat4
    | SetFill Color
    | SetStroke ( Float, Color )


type State
    = State
        { t : Float
        , dt : Float
        }


type alias Sketch model =
    { update : State -> model -> model
    , draw : model -> List DrawCommand
    }


run : model -> Sketch model -> Platform.Program () ( State, model ) Msg
run seed sketch =
    Platform.worker { init = init seed, update = update sketch, subscriptions = subscriptions }


init : model -> () -> ( ( State, model ), Cmd Msg )
init seed () =
    let
        state =
            ( State { t = 0, dt = 0 }, seed )

        setupArgs =
            E.object [ ( "type", E.string "2d" ) ]

        cmd =
            setup setupArgs
    in
    ( state, cmd )


update : Sketch model -> Msg -> ( State, model ) -> ( ( State, model ), Cmd Msg )
update sketch msg ( State state, model ) =
    case msg of
        Tick t ->
            let
                newState =
                    State { state | t = t, dt = t - state.t }

                newModel =
                    sketch.update newState model

                commands =
                    encodeCommands (sketch.draw newModel)
            in
            ( ( newState, newModel ), draw commands )


subscriptions : model -> Sub Msg
subscriptions _ =
    tick Tick


encodeCommands : List DrawCommand -> E.Value
encodeCommands commands =
    E.list encodeCommand (List.reverse commands)


encodeCommand : DrawCommand -> E.Value
encodeCommand command =
    let
        ( name, fields ) =
            case command of
                Draw (Object o) ->
                    ( "draw"
                    , [ ( "x", E.float (V2.getX o.position) )
                      , ( "y", E.float (V2.getY o.position) )
                      , ( "shape", encodeShape o.shape )
                      ]
                    )

                SetTransform matrix ->
                    ( "setTransform"
                    , [ ( "matrix", encodeMatrix matrix ) ]
                    )

                SetFill color ->
                    ( "setFill", [ ( "color", encodeColor color ) ] )

                SetStroke ( width, color ) ->
                    ( "setStroke", [ ( "width", E.float width ), ( "color", encodeColor color ) ] )
    in
    E.object (( "command", E.string name ) :: fields)


drawAt : Shape -> Float -> Float -> DrawCommand
drawAt shape x y =
    Draw (Object { shape = shape, position = V2.vec2 x y })


text : String -> Shape
text t =
    Text t


rect : Float -> Float -> Shape
rect w h =
    Rect ( w, h )


circle : Float -> Shape
circle r =
    Circle r


lineTo : Float -> Float -> Shape
lineTo x y =
    LineTo (V2.vec2 x y)


fill : Color -> DrawCommand
fill color =
    SetFill color


stroke : Float -> Color -> DrawCommand
stroke width color =
    SetStroke ( width, color )


noStroke : DrawCommand
noStroke =
    SetStroke ( 0, ( 0, 0, 0 ) )


encodeColor : Color -> E.Value
encodeColor ( r, g, b ) =
    E.object
        [ ( "r", E.float r )
        , ( "g", E.float g )
        , ( "b", E.float b )
        ]


encodeMatrix : Mat4 -> E.Value
encodeMatrix m =
    let
        mr =
            M4.toRecord m
    in
    E.list E.float
        [ mr.m11
        , mr.m12
        , mr.m13
        , mr.m14
        , mr.m21
        , mr.m22
        , mr.m23
        , mr.m24
        , mr.m31
        , mr.m32
        , mr.m33
        , mr.m34
        , mr.m41
        , mr.m42
        , mr.m43
        , mr.m44
        ]


encodeShape : Shape -> E.Value
encodeShape shape =
    case shape of
        Text t ->
            E.object
                [ ( "type", E.string "text" )
                , ( "text", E.string t )
                ]

        Rect ( w, h ) ->
            E.object
                [ ( "type", E.string "rect" )
                , ( "width", E.float w )
                , ( "height", E.float h )
                ]

        Circle radius ->
            E.object
                [ ( "type", E.string "circle" )
                , ( "radius", E.float radius )
                ]

        LineTo point ->
            E.object
                [ ( "type", E.string "lineTo" )
                , ( "x", E.float (V2.getX point) )
                , ( "y", E.float (V2.getY point) )
                ]
