json.array!(@games) do |game|
  json.extract! game, :id, :a, :b, :c, :d, :e, :f, :g, :h, :i, :is_complete, :current_player
  json.url game_url(game, format: :json)
end
