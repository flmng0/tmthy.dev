port module Sketch exposing (..)

import Browser
import Browser.Events

import Html as H
import Html.Attributes as A

import Json.Encode as E

import Time

port started : String -> Cmd msg
port submitFrame : E.Value -> Cmd msg
port tick : (Float -> msg) -> Sub msg


type Shape
  = Line Float Float Float Float
  | Rect Float Float Float Float

type alias DrawCmdInner =
  { shape : Shape
  , strokeWidth : Float
  , strokeColor : String
  , fillColor : String
  }

type DrawCmd = DrawCmd DrawCmdInner

type alias Config model =
  { init : model
  , update : Float -> model -> model
  , draw : model -> List DrawCmd 
  }

type Message
  = Tick Float
  -- | Resize


drawShape : Shape -> DrawCmd
drawShape s =
  DrawCmd
    { shape = s
    , strokeWidth = 0.0
    , strokeColor = "grey"
    , fillColor = "black"
    }

line : Float -> Float -> Float -> Float -> DrawCmd
line x1 y1 x2 y2 =
  drawShape (Line x1 y1 x2 y2)

rect : Float -> Float -> Float -> Float -> DrawCmd
rect x y w h =
  drawShape (Rect x y w h)

withFill : String -> DrawCmd -> DrawCmd
withFill f dc =
  let i = inner dc in
  DrawCmd { i | fillColor = f }

withStroke : String -> Float -> DrawCmd -> DrawCmd
withStroke sc sw dc =
  dc
  |> withStrokeColor sc
  |> withStrokeWidth sw

withStrokeColor : String -> DrawCmd -> DrawCmd
withStrokeColor s dc =
  let i = inner dc in
  DrawCmd { i | strokeColor = s }

withStrokeWidth : Float -> DrawCmd -> DrawCmd
withStrokeWidth w dc =
  let i = inner dc in
  DrawCmd { i | strokeWidth = w }

inner : DrawCmd -> DrawCmdInner
inner dc =
  case dc of
    DrawCmd i ->
      i


run : Config model -> Program () model Message
run config =
  let
    init _ = 
      ( config.init , started canvasId )
    
  in
  Browser.element
    { init = init
    , view = view
    , update = update config
    , subscriptions = subscriptions
    }

view : model -> H.Html msg
view _ =
  H.canvas [ A.id canvasId, A.width width, A.height height ] []

update config msg model =
  case msg of
    Tick t ->
      let
        newModel = config.update t model
        cmds = config.draw newModel |> encodeDrawCmdAll
      in
      ( newModel , submitFrame cmds )

encodeDrawCmdAll : List DrawCmd -> E.Value
encodeDrawCmdAll cmds =
  E.list encodeDrawCmd cmds

encodeDrawCmd : DrawCmd -> E.Value
encodeDrawCmd cmd =
  let c = inner cmd in
  E.object
    [ ( "shape", encodeShape c.shape )
    , ( "strokeWidth", E.float c.strokeWidth )
    , ( "strokeColor", E.string c.strokeColor )
    , ( "fillColor", E.string c.fillColor )
    ]

encodeShape : Shape -> E.Value
encodeShape s =
  let
    (type_, arguments) =
      case s of
        Line x1 y1 x2 y2 ->
          ( "line" , [x1, y1, x2, y2] )

        Rect x y w h ->
          ( "rect" , [x, y, w, h] )
  in
  E.object
    [ ( "type", E.string type_ )
    , ( "arguments", E.list E.float arguments )
    ]
      

subscriptions : model -> Sub Message
subscriptions _ =
  tick Tick

width : Int
width = 600

height : Int
height = 600

canvasId : String
canvasId = "sketch-cvs"
