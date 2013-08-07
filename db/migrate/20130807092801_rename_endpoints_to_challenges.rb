class RenameEndpointsToChallenges < ActiveRecord::Migration
    def self.up
        rename_table :endpoints, :challenges
    end 
    def self.down
        rename_table :challenges, :endpoints
    end
end
