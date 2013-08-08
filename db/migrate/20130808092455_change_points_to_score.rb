class ChangePointsToScore < ActiveRecord::Migration
  def change
  	rename_column :completions, :points, :score
  end
end
