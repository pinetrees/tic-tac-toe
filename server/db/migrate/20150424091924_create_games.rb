class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :a, :default => 0
      t.integer :b, :default => 0
      t.integer :c, :default => 0
      t.integer :d, :default => 0
      t.integer :e, :default => 0
      t.integer :f, :default => 0
      t.integer :g, :default => 0
      t.integer :h, :default => 0
      t.integer :i, :default => 0
      t.boolean :is_complete, :default => 0
      t.integer :current_player, :default => 1

      t.timestamps null: false
    end
  end
end
