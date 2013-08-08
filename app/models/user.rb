class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  has_many :completions
  has_many :completed_challenges, :through => :completions, :source => :challenge
  has_many :challenges
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
end
