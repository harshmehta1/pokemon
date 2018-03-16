# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :pokemon,
  ecto_repos: [Pokemon.Repo]

# Configures the endpoint
config :pokemon, PokemonWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "+dUTL5KML0Uq0NAX/D6Mpcetvk19B0t4Uj8JNS9XZTTWdtOlO3aef6a9P8oza5gF",
  render_errors: [view: PokemonWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: Pokemon.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
