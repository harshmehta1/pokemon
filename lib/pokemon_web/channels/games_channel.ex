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
    broadcast! socket, "state_update", game
    {:noreply, socket}
  end

  def handle_info({:game_update, game}, socket) do
    broadcast! socket, "state_update", game
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


  def handle_in("attack", params, socket) do
    IO.inspect("ATTACK")
    game = Game.attack(socket.assigns[:game], params)
    IO.inspect("GAME RECEIVED")
    IO.inspect(game)
    IO.inspect("GAME RECEIVED END")

    send(self, {:game_update, game})
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_info({:restart_game, game}, socket) do
    broadcast! socket, "restart_game", game
    {:noreply, socket}
  end

  def handle_in("reset_game", game, socket) do
    userName = socket.assigns[:user]
    game = Game.update_state(game)
    game = Game.add_user(game, userName)
    send(self, {:game_update, game})
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("restart", %{}, socket) do
    game = Game.new()
    send(self, {:restart_game, game})
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("leave", userid, socket) do
    IO.inspect("EXITING")
    game = Game.handle_exit(socket.assigns[:game], userid)
    Pokemon.GameBackup.save(socket.assigns[:name], game)
    send(self, {:game_update, game})
    socket = assign(socket, :game, game)
    {:noreply, socket}
  end

end
