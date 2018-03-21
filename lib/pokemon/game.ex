defmodule Pokemon.Game do

  def new do
    # init game
    %{
      player1: "",
      player2: "",
      poke1: [],
      poke2: [],
      observers: [],
      players_turn: ""
    }
  end

 def addPlayer(game, player, pokemon) do
   state = game.state
   if player == 1 do
     %{
       player1: game.player1 ++ [[pokemon, 100, 0]],
       player2: game.player2,
       poke1: game.poke1 ++ [[pokemon]],
       poke2: game.poke2,
       state: game.state
      }
   else
     %{
       player1: game.player1,
       player2: game.player2 ++ [[pokemon, 100, 0]],
       poke1: game.poke1,
       poke2: game.poke2 ++ [[pokemon]],
       state: game.state
      }
    end
  end

  def client_view(game) do
    %{
      player1: game.player1,
      player2: game.player2,
      poke1: game.poke1,
      poke2: game.poke2,
      observers: game.observers,
      players_turn: game.players_turn
    }
  end

 def genInitPokemons() do
   [
     %{:name => "Pikachu", :hp => 100, :energy => 100,
        :attacks => %{:quick_attack => 10,
                      :electric_shock => 20,
                      :thunder_bolt => 30,
                      :spl_thunder_shock => 50},
        :type => "Electric",
        :weakness => "Grass"},
    %{:name => "Charmander", :hp => 100, :energy => 100,
       :attacks => %{:scratch => 10,
                     :lava_burn => 20,
                     :fire_fang => 30,
                     :spl_inferno => 50},
       :type => "Fire",
       :weakness => "Water"},
    %{:name => "Squirtle", :hp => 100, :energy => 100,
        :attacks => %{:tail_whip => 10,
                      :water_gun => 20,
                      :aqua_tail => 30,
                      :spl_hydro_pump => 50},
        :type => "Water",
        :weakness => "Electric"},
    %{:name => "Bulbasaur", :hp => 100, :energy => 100,
       :attacks => %{:tackle => 10,
                     :vine_whip => 20,
                     :razor_leaf => 30,
                     :spl_seed_bomb => 50},
      :type => "Grass",
      :weakness => "Fire"},
   ]
  end

  # Method to determine state of userName
  defp get_player(game, userName) do
    cond do
      game.player1 == userName ->
      # player 1
        1
      game.player2 == userName ->
      # player 2
        2
      Enum.member?(game.observers, userName) ->
      # observers
        0
      true ->
      # catch any unhandled cases
        -1
    end
  end

  # Add user to a game
  def add_user(game, userName) do
    cond do
      game.player1 == userName or game.player2 == userName or Enum.member?(game.observers, userName) ->
        game
      game.player1 == "" and game.player2 == "" ->
        if :rand.uniform(2) == 1 do
          Map.put(game, :player1, userName)
        else
          game
          |> Map.put(:player2, userName)
          |> Map.put(:players_turn, userName)
        end
      game.player1 == "" or game.player2 == "" ->
        if game.player1 == "" do
          Map.put(game, :player1, userName)
        else
          game
          |> Map.put(:player2, userName)
          |> Map.put(:players_turn, userName)
        end
      true ->
        Map.put(game, :observers, List.insert_at(game.observers, -1, userName))
    end
  end
 

end
