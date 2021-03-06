defmodule PokemonWeb.PageController do
  use PokemonWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  def game(conn, params) do
    render conn, "game.html", game: params["game"], userName: params["userName"], id: params["id"]
  end
end
