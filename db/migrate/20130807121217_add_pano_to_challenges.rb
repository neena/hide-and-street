class AddPanoToChallenges < ActiveRecord::Migration
  def change
  	add_column :challenges, :pano, :string
  end
end
