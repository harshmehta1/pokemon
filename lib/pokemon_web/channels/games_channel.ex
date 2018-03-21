defmodule PokemonWeb.GamesChannel do
  use PokemonWeb, :channel

  alias Pokemon.Game

  def join("games:" <> name, params, socket) do
    userName = params["userName"]
    game = Pokemon.GameBackup.load(name) || Game.new()
    game = Game.add_user(game, userName)
    socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}  
  end

end
