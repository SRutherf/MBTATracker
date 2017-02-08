# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :mbta_tracker,
  ecto_repos: [MbtaTracker.Repo]

# Configures the endpoint
config :mbta_tracker, MbtaTracker.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "z2E681WGFTOBxneZzxi/HPhM780R9Z8ZHavgtFnv/2O4yAA29wcXFMwZaWkZ4+EO",
  render_errors: [view: MbtaTracker.ErrorView, accepts: ~w(html json)],
  pubsub: [name: MbtaTracker.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"
