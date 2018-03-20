defmodule Pokemon.Game do

  def new do
    # init game
    %{
      player1: [],
      player2: [],
      poke1: [],
      poke2: [],
    }
  end

 def addPlayer(game) do
     %{
       player1: [],
       player2: [],
      }
  end

  def client_view(game) do
    %{
      #state here
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
                     :spl_inferno => 50}
       :type => "Fire",
       :weakness => "Water"},
    %{:name => "Squirtle", :hp => 100, :energy => 100,
        :attacks => %{:tail_whip => 10,
                      :water_gun => 20,
                      :aqua_tail => 30,
                      :spl_hydro_pump => 50}
        :type => "Water",
        :weakness => "Electric"},
    %{:name => "Bulbasaur", :hp => 100, :energy => 100,
       :attacks => %{:tackle => 10,
                     :vine_whip => 20,
                     :razor_leaf => 30,
                     :spl_seed_bomb => 50}
      :type => "Grass",
      :weakness => "Fire"},
   ]
  end
end
