defmodule Pokemon.Game do

  def new do
    # init game
    %{
      player1: "",
      player2: "",
      poke1: [],
      poke2: [],
      attacker: "",
      game_over: false,
      dialogue: "",
      winner: ""
    }
  end


  def client_view(game) do
    %{
      player1: game.player1,
      player2: game.player2,
      poke1: game.poke1,
      poke2: game.poke2,
      attacker: game.attacker,
      game_over: game.game_over,
      dialogue: game.dialogue,
      winner: game.winner
    }
  end

def getPokeList() do
  [
  %{:name => "Pikachu", :hp => 100, :energy => 5,
      :attacks => [%{:name => "Quick Attack",
                     :dmg => 5,
                     :spl => false},
                  %{:name => "Electric Shock",
                    :dmg => 10,
                    :spl => false},
                  %{:name => "Thunder Bolt",
                    :dmg => 15,
                    :spl => false},
                  %{:name => "Thunder Shock",
                    :dmg => 30,
                    :spl => true},],
     :type => "Electric",
     :weakness => "Grass",
     :image => "/images/pikachu.png"},
 %{:name => "Charmander", :hp => 100, :energy => 5,
    :attacks => [%{:name => "Scratch",
                    :dmg => 5,
                    :spl => false},
                  %{:name => "Lava Burn",
                    :dmg => 10,
                    :spl => false},
                  %{:name => "Fire Fang",
                    :dmg => 15,
                    :spl => false},
                  %{:name => "Inferno",
                    :dmg => 30,
                    :spl => true},],
    :type => "Fire",
    :weakness => "Water",
    :image => "/images/charmander.png"},
 %{:name => "Squirtle", :hp => 100, :energy => 5,
 :attacks => [%{:name => "Tail Whip",
                :dmg => 5,
                :spl => false},
             %{:name => "Water Gun",
               :dmg => 10,
               :spl => false},
             %{:name => "Aqua Tail",
               :dmg => 15,
               :spl => false},
             %{:name => "Hydro Pump",
               :dmg => 30,
               :spl => true},],
     :type => "Water",
     :weakness => "Electric",
     :image => "/images/squirtle.png"},
 %{:name => "Bulbasaur", :hp => 100, :energy => 5,
 :attacks => [%{:name => "Tackle",
                :dmg => 5,
                :spl => false},
             %{:name => "Vine Whip",
               :dmg => 10,
               :spl => false},
             %{:name => "Razor Leaf",
               :dmg => 15,
               :spl => false},
             %{:name => "Seed Bomb",
               :dmg => 30,
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

  def update_state(game) do
    %{
      player1: Map.get(game, "player1"),
      player2: Map.get(game, "player2"),
      poke1: Map.get(game, "poke1"),
      poke2: Map.get(game, "poke2"),
      attacker: Map.get(game, "attacker"),
      game_over: Map.get(game, "game_over"),
      dialogue: Map.get(game, "dialogue"),
      winner: Map.get(game, "winner")
    }
  end

  def attack(game, atkMap) do
    energyFactor = 0
    effectDialogue = ""
    dmgFactor = 1
    effect = Map.get(atkMap, "effect")
    random_number = :rand.uniform(100)
    poke1_type = Map.get(game.poke1, "type")
    poke1_weakness = Map.get(game.poke1, "weakness")
    poke2_type = Map.get(game.poke2, "type")
    poke2_weakness = Map.get(game.poke2, "weakness")
    weakness_text = ""
    IO.inspect(random_number)
    if random_number >= 20 do
      cond do
        effect == "low" ->
          dmgFactor = 0.5
          energyFactor = 20
          effectDialogue = ", but, it was very WEAK!"
        effect == "med" ->
          dmgFactor = 1
          energyFactor = 30
          effectDialogue = "and, it was EFFECTIVE!"
        effect == "high" ->
          dmgFactor = 1.5
          energyFactor = 40
          effectDialogue = "and, it was SUPER EFFECTIVE!"
      end

      cond do
        game.attacker == game.player1 ->
          dmg = Map.get(atkMap, "dmg")
          poke1_name = Map.get(game.poke1, "name")
          poke2_name = Map.get(game.poke2, "name")
          atk_name = Map.get(atkMap, "name")
          finDmg = dmg * dmgFactor
          if poke2_weakness == poke1_type do
            finDmg = finDmg + 5
            weakness_text = Enum.join([poke2_name,"is weaker to",poke2_weakness,"type Pokemons. Thus, receiving an additional damage of 5 HP!"]," ")
          end
          spl = Map.get(atkMap, "spl")
            if spl != true do
              energy = Map.get(game.poke1, "energy")
                energy = energy + energyFactor
                if energy > 100 do
                  energy = 100
                end
            else
              energy = 5
            end
            poke1 = Map.replace!(game.poke1, "energy", energy)
            poke2hp = Map.get(game.poke2, "hp")
            finDmg = Kernel.round(finDmg)
            poke2hp = poke2hp - finDmg
            poke2 = Map.replace!(game.poke2, "hp", poke2hp)
            game = Map.replace!(game, :poke1, poke1)
            game = Map.replace!(game, :poke2, poke2)
            game = Map.replace!(game, :attacker, game.player2)

            newDialogue = Enum.join([poke1_name,"used",atk_name,effectDialogue,"It caused", poke2_name,"a damage of",finDmg,"HP!",weakness_text]," ")
            game = Map.replace!(game, :dialogue, newDialogue)

            if poke2hp <= 0 do
              poke2 = Map.replace!(game.poke2, "hp", 0)
              game = Map.replace!(game, :poke2, poke2)
              game = Map.replace!(game, :game_over, true)
              nd = Enum.join([game.player1,"has WON this battle!"]," ")
              game = Map.replace!(game, :dialogue, nd)
              game = Map.replace!(game, :winner, game.player1)
              game
            else
              game
            end
      game.attacker == game.player2 ->
          dmg = Map.get(atkMap, "dmg")
          spl = Map.get(atkMap, "spl")
          poke1_name = Map.get(game.poke1, "name")
          poke2_name = Map.get(game.poke2, "name")
          atk_name = Map.get(atkMap, "name")
          finDmg = dmg * dmgFactor
          if poke1_weakness == poke2_type do
            finDmg = finDmg + 5
            weakness_text = Enum.join([poke1_name,"is weaker to",poke1_weakness,"type Pokemons. Thus, receiving an additional damage of 5 HP!"]," ")
          end
          if spl != true do
            energy = Map.get(game.poke2, "energy")
              energy = energy + energyFactor
              if energy > 100 do
                energy = 100
              end
          else
            energy = 5
          end
            poke2 = Map.replace!(game.poke2, "energy", energy)
            poke1hp = Map.get(game.poke1, "hp")
            finDmg = Kernel.round(finDmg)
            poke1hp = poke1hp - finDmg
            poke1 = Map.replace!(game.poke1, "hp", poke1hp)
            game = Map.replace!(game, :poke1, poke1)
            game = Map.replace!(game, :poke2, poke2)
            game = Map.replace!(game, :attacker, game.player1)

            newDialogue = Enum.join([poke2_name,"used",atk_name,effectDialogue,"It caused", poke1_name,"a damage of",finDmg,"HP!",weakness_text]," ")
            game = Map.replace!(game, :dialogue, newDialogue)
            if poke1hp <= 0 do
              poke1 = Map.replace!(game.poke1, "hp", 0)
              game = Map.replace!(game, :poke1, poke1)
              game = Map.replace!(game, :game_over, true)
              nd = Enum.join([game.player2,"has WON this battle!"]," ")
              game = Map.replace!(game, :dialogue, nd)
              game = Map.replace!(game, :winner, game.player2)
              game
            else
              game
            end
        true ->
            game
      end
    else
      poke1_name = Map.get(game.poke1, "name")
      poke2_name = Map.get(game.poke2, "name")
      atk_name = Map.get(atkMap, "name")
      atk_spl = Map.get(atkMap, "spl")
      if game.attacker == game.player1 do
        newDialogue = Enum.join([poke1_name,"used",atk_name,"but it was BLOCKED by",poke2_name]," ")
        game = Map.replace!(game, :dialogue, newDialogue)
        game = Map.replace!(game, :attacker, game.player2)
        if atk_spl == true do
          new_poke1 = Map.replace!(game.poke1, "energy", 5)
          game = Map.replace!(game, :poke1, new_poke1)
        end
      else
        newDialogue = Enum.join([poke2_name,"used",atk_name,"but it was BLOCKED by",poke1_name]," ")
        game = Map.replace!(game, :dialogue, newDialogue)
        game = Map.replace!(game, :attacker, game.player1)
        if atk_spl == true do
          new_poke2 = Map.replace!(game.poke2, "energy", 5)
          game = Map.replace!(game, :poke2, new_poke2)
        end
      end
      game
    end
  end

  def add_user(game, userName) do
    # IO.inspect(userName)
    cond do
      game.player1 == "" and game.player2 == "" ->
        pokemon = randPokemon(game)
        pokemon = Map.put(pokemon, :id, "p1")
        game = Map.replace!(game, :player1, userName)
        game = Map.replace!(game, :attacker, userName)
        game = Map.put(game, :poke1, pokemon)
        # IO.inspect(game)
      game.player1 != "" and game.player2 == "" and game.player1 != userName ->
        pokemon = randPokemon(game)
        pokemon = Map.put(pokemon, :id, "p2")
        game = Map.replace!(game, :player2, userName)
        game = Map.put(game, :poke2, pokemon)
        # IO.inspect(game)
      true ->
        game
        # IO.inspect(game)
    end
  end

  def handle_exit(game, userName) do
    cond do
      userName == game.player1 ->
        game = Map.replace!(game, :winner, game.player2)
        newDialogue = Enum.join([game.player1,"has left the game"]," ")
        game = Map.replace!(game, :dialogue, newDialogue)
        game = Map.replace!(game, :game_over, true)
        game
      userName == game.player2 ->
        game = Map.replace!(game, :winner, game.player1)
        newDialogue = Enum.join([game.player2,"has left the game"]," ")
        game = Map.replace!(game, :dialogue, newDialogue)
        game = Map.replace!(game, :game_over, true)
        game
      true ->
        game
    end
  end



end
