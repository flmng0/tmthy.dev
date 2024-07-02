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

-- type alias State =
--   { width : Int
--   , height : Int
--   , mouse : MouseState
--   , keyboard : KeyboardState
--   }
--
-- type alias MouseState =
--   { x : Float
--   , y : Float
--   , buttons : Int
--   }

type Shape
  = Line Float Float
  | Rect Float Float
  | Circle Float

type alias DrawCmdInner =
  { shape : Shape
  , position : { x : Float , y : Float }
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
    , position = { x = 0.0, y = 0.0 }
    , strokeWidth = 0.0
    , strokeColor = "grey"
    , fillColor = "black"
    }

clear : String -> DrawCmd
clear color =
  DrawCmd
    { shape = Rect (toFloat width) (toFloat height)
    , position = { x = 0.0 , y = 0.0 }
    , strokeWidth = 0.0
    , strokeColor = "transparent"
    , fillColor = color
    }

line : Float -> Float -> Float -> Float -> DrawCmd
line x1 y1 x2 y2 = 
  let
      dx = x2 - x1
      dy = y2 - y1
  in
  drawShape (Line dx dy) |> move x1 y1

rect : Float -> Float -> DrawCmd
rect w h =
  drawShape (Rect w h)

circle : Float -> DrawCmd
circle r =
  drawShape (Circle r)

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

move : Float -> Float -> DrawCmd -> DrawCmd
move dx dy dc =
  let
      i = inner dc
      x = i.position.x + dx
      y = i.position.y + dy
      p = { x = x, y = y }
  in
  DrawCmd { i | position = p }

center : DrawCmd -> DrawCmd
center = move (toFloat width / 2) (toFloat height / 2)

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
  H.canvas [ A.class "sketch-canvas", A.id canvasId, A.width width, A.height height ] []

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
  let i = inner cmd in
  E.object
    [ ( "shape", encodeShape i )
    , ( "strokeWidth", E.float i.strokeWidth )
    , ( "strokeColor", E.string i.strokeColor )
    , ( "fillColor", E.string i.fillColor )
    ]

encodeShape : DrawCmdInner -> E.Value
encodeShape i =
  let
      s = i.shape
      x = i.position.x
      y = i.position.y

      (type_, arguments) =
        case s of
          Line dx dy ->
            let
                x2 = x + dx
                y2 = y + dy
            in
            ( "line" , [x, y, x2, y2] )

          Rect w h ->
            ( "rect" , [x, y, w, h] )

          Circle r ->
            ( "circle" , [x, y, r] )
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

-- This is here just so that the project builds.
main =
  H.text "How are you seeing this?"

