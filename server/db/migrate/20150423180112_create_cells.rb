class CreateCells < ActiveRecord::Migration
  def change
    create_table :cells do |t|
      t.integer :row
      t.integer :column
      t.integer :state

      t.timestamps null: false
    end
  end
end
