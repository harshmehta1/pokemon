defmodule Pokemon.Game do

  def new do
    # init game
    %{
      player1: "",
      player2: "",
      poke1: [],
      poke2: [],
      attacker: "",
      ready_to_fire: false,
      game_over: false
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
      attacker: game.attacker,
      observers: [],
      game_over: game.game_over
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
      attacker: Map.get(game, "attacker"),
      ready_to_fire: Map.get(game, "ready_to_fire"),
      game_over: Map.get(game, "game_over")
    }
  end

  # method to register clicks from UI
  def clicked(game) do
    cond do 
      game.attacker == game.player1 ->
        %{ 
          player1: Map.get(game, "player1"),
          player2: Map.get(game, "player2"),
          poke1: Map.get(game, "poke1"),
          poke2: Map.get(game, "poke2"),
          observers: [],
          attacker: Map.get(game, "attacker"),
          ready_to_fire: true
         }
      true ->
        game
        IO.inspect(game)
    end
  end

  def attack(game, atkMap) do
      cond do
        game.attacker == game.player1 ->
          dmg = Map.get(atkMap, "dmg")
          spl = Map.get(atkMap, "spl")
          energy = Map.get(game.poke1, "energy")

          if energy < 100 && spl == true do
            game
          else
            energy = energy + 20
            poke1 = Map.replace!(game.poke1, "energy", energy)
            poke2hp = Map.get(game.poke2, "hp")
            poke2hp = poke2hp - dmg
            poke2 = Map.replace!(game.poke2, "hp", poke2hp)
            game = Map.replace!(game, :poke1, poke1)
            game = Map.replace!(game, :poke2, poke2)
            game = Map.replace!(game, :attacker, game.player2)

            if poke2hp <= 0 do
              poke2 = Map.replace!(game.poke2, "hp", 0)
              game = Map.replace!(game, :poke2, poke2)
              game = Map.replace!(game, :game_over, true)
              game
            else 
              game
            end
          end
        game.attacker == game.player2 ->
          dmg = Map.get(atkMap, "dmg")
          spl = Map.get(atkMap, "spl")
          energy = Map.get(game.poke2, "energy")

          if energy < 100 && spl == true do
            game
          else
            energy = energy + 20
            poke2 = Map.replace!(game.poke2, "energy", energy)
            poke1hp = Map.get(game.poke1, "hp")
            poke1hp = poke1hp - dmg
            poke1 = Map.replace!(game.poke1, "hp", poke1hp)
            game = Map.replace!(game, :poke1, poke1)
            game = Map.replace!(game, :poke2, poke2)
            game = Map.replace!(game, :attacker, game.player1)

            if poke1hp <= 0 do
              poke1 = Map.replace!(game.poke1, "hp", 0)
              game = Map.replace!(game, :poke1, poke1)
              game = Map.replace!(game, :game_over, true)
              game
            else 
              game
            end
          end
        true ->
          game
      end
  end

  def add_user(game, userName) do
    IO.inspect(userName)
    cond do
      game.player1 == "" and game.player2 == "" ->
        pokemon = randPokemon(game)
        pokemon = Map.put(pokemon, :id, "p1")
        game = Map.replace!(game, :player1, userName)
        game = Map.replace!(game, :attacker, userName)
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



end
