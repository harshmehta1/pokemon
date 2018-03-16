defmodule PokemonWeb.PageController do
  use PokemonWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
