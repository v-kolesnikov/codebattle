defmodule CodebattleWeb.Router do
  use Codebattle.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Codebattle.Plugs.Authorization
    plug CodebattleWeb.Locale
    plug :put_user_token
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/auth", CodebattleWeb do
    pipe_through :browser

    get "/logout", AuthController, :logout

    get "/:provider", AuthController, :request
    get "/:provider/callback", AuthController, :callback
  end

  scope "/", CodebattleWeb do
    pipe_through :browser # Use the default browser stack

    get "/", PageController, :index

    resources "/games", GameController
  end

  # Other scopes may use custom stacks.
  # scope "/api", Codebattle do
  #   pipe_through :api
  # end
  defp put_user_token(conn, _) do
    case conn.assigns[:is_authenticated?] do
      true ->
        current_user = conn.assigns.user.id
        user_id_token = Phoenix.Token.sign(conn, "user_id", current_user)

        conn
        |> assign(:user_id, user_id_token)
      _ ->
        conn
      end
  end
end
