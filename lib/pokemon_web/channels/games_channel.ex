defmodule PokemonWeb.GamesChannel do
  use PokemonWeb, :channel

  alias Pokemon.Game

  def join("games:" <> name, payload, socket) do
    IO.inspect(name)
    if authorized?(payload) do
      game = Pokemon.GameBackup.load(name) || Game.new()
      game = Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end


  # def handle_in("clicked", %{"index" => ii}, socket) do
  #   game = Game.clicked(socket.assigns[:game], ii)
  #   Pokemon.GameBackup.save(socket.assigns[:name], game)
  #   socket = assign(socket, :game, game)
  #   {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  # end
  #
  # def handle_in("match", %{}, socket) do
  #   game = Game.pair(socket.assigns[:game])
  #   Pokemon.GameBackup.save(socket.assigns[:name], game)
  #   socket = assign(socket, :game, game)
  #   {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  # end
  #
  # def handle_in("restart", %{}, socket) do
  #   game = Game.new()
  #   Pokemon.GameBackup.save(socket.assigns[:name], game)
  #   socket = assign(socket, :game, game)
  #   {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  # end

  defp authorized?(_payload) do
    true
  end
end
