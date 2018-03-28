use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :pokemon, PokemonWeb.Endpoint,
  secret_key_base: "Hr6/umwjF7FzwFz23bvXKSKkkLgGf+U/kaQW+aFbuiqdCgvd7Ok7/OLu24t9Mjgi"

# Configure your database
config :pokemon, Pokemon.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "pokemon",
  password: "water1melon",
  database: "pokemon_prod",
  pool_size: 15
