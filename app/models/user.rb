class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :completions
  has_many :completed_challenges, :through => :completions, :source => :challenge #completion
  has_many :challenges, :foreign_key => :creator_id #creator
  has_many :challenge_invites, :class_name => "Challenge", :foreign_key => :seeker_id #challenged to 
  def score 
  	completions.sum(:score)
  end
  def has_completed?(challenge)
  	completed_challenges.include?(challenge)
  end
  def complete_challenge!(challenge, score)
		unless has_completed?(challenge)
			completions.create!({:challenge => challenge, :score => score}) 
		end
  end
  def incomplete_challenges
    challenge_invites.select{|challenge| !has_completed?(challenge)}
  end
end
