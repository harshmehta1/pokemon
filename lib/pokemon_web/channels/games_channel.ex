defmodule PokemonWeb.GamesChannel do
  use PokemonWeb, :channel

  alias Pokemon.Game
  alias PokemonWeb.Presence

  def join("games:" <> name, params, socket) do
    userName = params["userName"]
    IO.inspect(Pokemon.GameBackup.load(name))
    game = Pokemon.GameBackup.load(name) || Game.new()
    game = Game.add_user(game, userName)
    send(self, {:after_join, game})
    Pokemon.GameBackup.save(name, game)
    socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      |> assign(:user, userName)
    {:ok, %{"join" => name, "game" => Game.client_view(game)}, socket}
  end

  def handle_info({:after_join, game}, socket) do
    IO.inspect("AFTER_JOIN")
    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, socket.assigns[:user], %{
       online_at: inspect(System.system_time(:seconds))
    })
    broadcast! socket, "user:joined", game
    {:noreply, socket}
  end

  def handle_in("update_state", game, socket) do
    IO.inspect("broadcast received")
    IO.inspect(game)
    game = Game.update_state(game)
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("clicked", %{}, socket) do
    name = socket.assigns[:name]
    game = Pokemon.GameBackup.load(name)
    game = Game.clicked(game)
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    broadcast! socket, "update", %{game: game}
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end


end
