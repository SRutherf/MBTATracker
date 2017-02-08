defmodule MbtaTracker.PageController do
  use MbtaTracker.Web, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end
