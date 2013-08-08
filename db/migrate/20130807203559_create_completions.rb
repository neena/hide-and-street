class CreateCompletions < ActiveRecord::Migration
  def change
    create_table :completions do |t|
    	t.belongs_to :user, :null => false
    	t.belongs_to :challenge, :null => false
    	t.integer :points, :default => 0 
      t.timestamps
    end
  end
end
