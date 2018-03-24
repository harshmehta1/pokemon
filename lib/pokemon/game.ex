defmodule Pokemon.Game do

  def new do
    # init game
    %{
      player1: "",
      player2: "",
      poke1: [],
      poke2: [],
      observers: [],
      players_turn: "",
      ready_to_fire: false
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
      observers: [],
      players_turn: game.players_turn,
    }
  end

def getPokeList() do
  [
  %{:name => "Pikachu", :hp => 100, :energy => 0,
      :attacks => [%{:name => "Quick Attack",
                     :dmg => 10,
                     :spl => false},
                  %{:name => "Electric Shock",
                    :dmg => 20,
                    :spl => false},
                  %{:name => "Thunder Bolt",
                    :dmg => 30,
                    :spl => false},
                  %{:name => "Thunder Shock",
                    :dmg => 50,
                    :spl => true},],
     :type => "Electric",
     :weakness => "Grass",
     :image => "/images/pikachu.png"},
 %{:name => "Charmander", :hp => 100, :energy => 0,
    :attacks => [%{:name => "Scratch",
                    :dmg => 10,
                    :spl => false},
                  %{:name => "Lava Burn",
                    :dmg => 20,
                    :spl => false},
                  %{:name => "Fire Fang",
                    :dmg => 30,
                    :spl => false},
                  %{:name => "Inferno",
                    :dmg => 50,
                    :spl => true},],
    :type => "Fire",
    :weakness => "Water",
    :image => "/images/charmander.png"},
 %{:name => "Squirtle", :hp => 100, :energy => 0,
 :attacks => [%{:name => "Tail Whip",
                :dmg => 10,
                :spl => false},
             %{:name => "Water Gun",
               :dmg => 20,
               :spl => false},
             %{:name => "Aqua Tail",
               :dmg => 30,
               :spl => false},
             %{:name => "Hydro Pump",
               :dmg => 50,
               :spl => true},],
     :type => "Water",
     :weakness => "Electric",
     :image => "/images/squirtle.png"},
 %{:name => "Bulbasaur", :hp => 100, :energy => 0,
 :attacks => [%{:name => "Tackle",
                :dmg => 10,
                :spl => false},
             %{:name => "Vine Whip",
               :dmg => 20,
               :spl => false},
             %{:name => "Razor Leaf",
               :dmg => 30,
               :spl => false},
             %{:name => "Seed Bomb",
               :dmg => 50,
               :spl => true},],
   :type => "Grass",
   :weakness => "Fire",
   :image => "/images/bulbasaur.png"},
]
end

def randPokemon(game) do
  pokelist = getPokeList()
  poke = Enum.random(pokelist)
  if game.player1 != "" and poke.name == Map.get(game.poke1, "name") do
    poke = Enum.random(pokelist)
  end
  poke
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

  def player_join(game) do
    game
  end

  def update_state(game) do
    %{
      player1: Map.get(game, "player1"),
      player2: Map.get(game, "player2"),
      poke1: Map.get(game, "poke1"),
      poke2: Map.get(game, "poke2"),
      observers: [],
      players_turn: Map.get(game, "players_turn"),
      ready_to_fire: Map.get(game, "ready_to_fire")
    }
  end

  # Add user to a game
  # def add_user(game, userName) do
  #   cond do
  #     game.player1 == userName or game.player2 == userName or Enum.member?(game.observers, userName) ->
  #       game
  #     game.player1 == "" and game.player2 == "" ->
  #       if :rand.uniform(2) == 1 do
  #         Map.put(game, :player1, userName)
  #       else
  #         game
  #         |> Map.put(:player2, userName)
  #         |> Map.put(:players_turn, userName)
  #       end
  #     game.player1 == "" or game.player2 == "" ->
  #       if game.player1 == "" do
  #         Map.put(game, :player1, userName)
  #       else
  #         game
  #         |> Map.put(:player2, userName)
  #         |> Map.put(:players_turn, userName)
  #       end
  #     true ->
  #       Map.put(game, :observers, List.insert_at(game.observers, -1, userName))
  #   end
  # end

  # method to register clicks from UI
  def clicked(game) do
    cond do 
      game.players_turn == game.player1 ->
        %{ 
          player1: Map.get(game, "player1"),
          player2: Map.get(game, "player2"),
          poke1: Map.get(game, "poke1"),
          poke2: Map.get(game, "poke2"),
          observers: [],
          players_turn: Map.get(game, "players_turn"),
          ready_to_fire: true
         }
      true ->
        game
        IO.inspect(game)
    end
  end

  def add_user(game, userName) do
    IO.inspect(userName)
    cond do
      game.player1 == "" and game.player2 == "" ->
        pokemon = randPokemon(game)
        pokemon = Map.put(pokemon, :id, "p1")
        game = Map.replace!(game, :player1, userName)
        game = Map.replace!(game, :players_turn, userName)
        game = Map.put(game, :poke1, pokemon)
        IO.inspect(game)
      game.player1 != "" and game.player2 == "" and game.player1 != userName ->
        pokemon = randPokemon(game)
        pokemon = Map.put(pokemon, :id, "p2")
        game = Map.replace!(game, :player2, userName)
        game = Map.put(game, :poke2, pokemon)
        IO.inspect(game)
      true ->
        game
        IO.inspect(game)
    end
  end

  # calc damage and energy increase of attack
  # update for skill bar modifier
  defp calc_damage(userName) do
    IO.inspect(userName)
      cond do
        # update for player 1 attacks
        userName == game.player1 ->
          Map.get_and_update(poke2, :hp, poke2.hp - poke1.dmg)
          Map.get_and_update(poke1, :energy, poke1.energy + 10)
        # update for player 2 attacks
        userName == game.player1 ->
          Map.get_and_update(poke1, :hp, poke1.hp - poke2.dmg)
          Map.get_and_update(poke2, :energy, poke2.energy + 10)
    end
  end


end
