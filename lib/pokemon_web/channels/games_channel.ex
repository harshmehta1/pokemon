defmodule PokemonWeb.GamesChannel do
  use PokemonWeb, :channel

  alias Pokemon.Game

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Pokemon.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  defp authorized?(_payload) do
    true
  end
end
